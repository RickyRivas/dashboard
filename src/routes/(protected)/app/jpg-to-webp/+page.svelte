<!-- src/routes/+page.svelte -->
<script>
	let selectedFiles = $state([]);
	let isConverting = $state(false);
	let quality = $state(80);

	let pendingCount = $derived(selectedFiles.filter((f) => f.status === 'pending').length);
	let convertingCount = $derived(selectedFiles.filter((f) => f.status === 'converting').length);
	let completeCount = $derived(selectedFiles.filter((f) => f.status === 'complete').length);
	let errorCount = $derived(selectedFiles.filter((f) => f.status === 'error').length);

	function handleFileSelect(event) {
		const files = Array.from(event.target.files);
		const validFiles = files.filter(
			(file) => file.type === 'image/jpeg' || file.type === 'image/jpg'
		);

		if (validFiles.length !== files.length) {
			alert(`${files.length - validFiles.length} file(s) skipped - only JPG/JPEG supported`);
		}

		selectedFiles = validFiles.map((file) => ({
			file,
			name: file.name,
			originalSize: file.size,
			status: 'pending', // pending, converting, complete, error
			convertedData: null,
			convertedSize: 0,
			error: null
		}));
	}

	async function convertFile(fileObj) {
		try {
			fileObj.status = 'converting';

			const formData = new FormData();
			formData.append('file', fileObj.file);
			formData.append('quality', quality.toString());

			const response = await fetch('/api/convert-to-webp', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Conversion failed');
			}

			const result = await response.json();
			fileObj.convertedData = result.data;
			fileObj.convertedSize = result.size;
			fileObj.status = 'complete';
		} catch (error) {
			fileObj.status = 'error';
			fileObj.error = error.message;
		}
	}

	async function convertAll() {
		isConverting = true;

		// Convert all files in parallel
		await Promise.all(
			selectedFiles
				.filter((f) => f.status === 'pending' || f.status === 'error')
				.map((fileObj) => convertFile(fileObj))
		);

		isConverting = false;
	}

	function downloadFile(fileObj) {
		if (!fileObj.convertedData) return;

		const link = document.createElement('a');
		link.href = fileObj.convertedData;
		link.download = fileObj.name.replace(/\.(jpg|jpeg)$/i, '.webp');
		link.click();
	}

	function downloadAll() {
		selectedFiles
			.filter((f) => f.status === 'complete')
			.forEach((fileObj, i) => {
				setTimeout(() => downloadFile(fileObj), i * 100);
			});
	}

	function removeFile(index) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
	}

	function reset() {
		selectedFiles = [];
		document.getElementById('fileInput').value = '';
	}

	function formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	function calculateSavings(original, converted) {
		if (original === 0 || converted === 0) return 0;
		return Math.round(((original - converted) / original) * 100);
	}

	function getTotalSavings() {
		const completed = selectedFiles.filter((f) => f.status === 'complete');
		if (completed.length === 0) return 0;

		const totalOriginal = completed.reduce((sum, f) => sum + f.originalSize, 0);
		const totalConverted = completed.reduce((sum, f) => sum + f.convertedSize, 0);

		return calculateSavings(totalOriginal, totalConverted);
	}
</script>

<div class="container">
	<h1>JPG to WebP Converter</h1>
	<p class="subtitle">Server-side batch conversion using Sharp.js</p>

	<div class="upload-section">
		<input
			id="fileInput"
			type="file"
			accept="image/jpeg,image/jpg"
			multiple
			onchange={handleFileSelect}
		/>

		{#if selectedFiles.length > 0}
			<div class="file-count">
				<strong>{selectedFiles.length}</strong> file(s) selected
			</div>

			<div class="quality-control">
				<label for="quality">Quality: {quality}%</label>
				<input
					id="quality"
					type="range"
					min="1"
					max="100"
					bind:value={quality}
					disabled={isConverting || completeCount > 0}
				/>
				<p class="quality-hint">Adjust before converting</p>
			</div>

			<div class="action-buttons">
				<button onclick={convertAll} disabled={isConverting || pendingCount === 0}>
					{#if isConverting}
						Converting... ({convertingCount}/{selectedFiles.length})
					{:else if pendingCount > 0}
						Convert {pendingCount} File{pendingCount !== 1 ? 's' : ''}
					{:else}
						All Converted
					{/if}
				</button>

				{#if completeCount > 0}
					<button onclick={downloadAll} class="secondary">
						Download All ({completeCount})
					</button>
				{/if}

				<button onclick={reset} class="tertiary">Reset</button>
			</div>

			{#if completeCount > 0}
				<div class="total-savings">
					Total savings: <strong>{getTotalSavings()}%</strong>
				</div>
			{/if}
		{/if}
	</div>

	{#if selectedFiles.length > 0}
		<div class="files-list">
			{#each selectedFiles as fileObj, index}
				<div
					class="file-item"
					class:complete={fileObj.status === 'complete'}
					class:error={fileObj.status === 'error'}
				>
					<div class="file-header">
						<div class="file-name">
							{fileObj.name}
						</div>
						<button class="remove-btn" onclick={() => removeFile(index)}>×</button>
					</div>

					<div class="file-details">
						<div class="status-badge" class:converting={fileObj.status === 'converting'}>
							{#if fileObj.status === 'pending'}
								<span class="badge pending">Pending</span>
							{:else if fileObj.status === 'converting'}
								<span class="badge converting">Converting...</span>
							{:else if fileObj.status === 'complete'}
								<span class="badge complete">✓ Complete</span>
							{:else if fileObj.status === 'error'}
								<span class="badge error">✗ Error</span>
							{/if}
						</div>

						{#if fileObj.status === 'complete'}
							<div class="size-info">
								<span
									>{formatBytes(fileObj.originalSize)} → {formatBytes(fileObj.convertedSize)}</span
								>
								<span class="savings"
									>(-{calculateSavings(fileObj.originalSize, fileObj.convertedSize)}%)</span
								>
							</div>
							<button onclick={() => downloadFile(fileObj)} class="download-btn"> Download </button>
						{:else if fileObj.status === 'error'}
							<div class="error-message">{fileObj.error}</div>
						{:else}
							<div class="size-info">
								{formatBytes(fileObj.originalSize)}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
		font-size: 0.9rem;
	}

	.upload-section {
		background: #f5f5f5;
		padding: 2rem;
		border-radius: 8px;
		text-align: center;
	}

	input[type='file'] {
		margin-bottom: 1rem;
	}

	.file-count {
		color: #666;
		margin: 1rem 0;
		font-size: 1.1rem;
	}

	.quality-control {
		margin: 1.5rem 0;
	}

	.quality-control label {
		display: block;
		margin-bottom: 0.5rem;
		color: #555;
		font-weight: 500;
	}

	.quality-hint {
		font-size: 0.85rem;
		color: #888;
		margin-top: 0.5rem;
	}

	input[type='range'] {
		width: 100%;
		max-width: 300px;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}

	button {
		background: #4caf50;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: #45a049;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	button.secondary {
		background: #2196f3;
	}

	button.secondary:hover {
		background: #0b7dda;
	}

	button.tertiary {
		background: #666;
	}

	button.tertiary:hover {
		background: #555;
	}

	.total-savings {
		margin-top: 1.5rem;
		font-size: 1.1rem;
		color: #4caf50;
	}

	.files-list {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.file-item {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		transition: all 0.2s;
	}

	.file-item.complete {
		border-color: #4caf50;
		background: #f1f8f4;
	}

	.file-item.error {
		border-color: #f44336;
		background: #ffebee;
	}

	.file-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.file-name {
		font-weight: 500;
		color: #333;
		word-break: break-all;
		flex: 1;
	}

	.remove-btn {
		background: #f44336;
		color: white;
		border: none;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		cursor: pointer;
		font-size: 1.25rem;
		line-height: 1;
		padding: 0;
		margin-left: 1rem;
		flex-shrink: 0;
	}

	.remove-btn:hover {
		background: #d32f2f;
	}

	.file-details {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.badge.pending {
		background: #fff3cd;
		color: #856404;
	}

	.badge.converting {
		background: #cce5ff;
		color: #004085;
		animation: pulse 1.5s infinite;
	}

	.badge.complete {
		background: #d4edda;
		color: #155724;
	}

	.badge.error {
		background: #f8d7da;
		color: #721c24;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.6;
		}
	}

	.size-info {
		color: #666;
		font-size: 0.9rem;
		flex: 1;
	}

	.savings {
		color: #4caf50;
		font-weight: 600;
		margin-left: 0.5rem;
	}

	.download-btn {
		background: #2196f3;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
	}

	.download-btn:hover {
		background: #0b7dda;
	}

	.error-message {
		color: #d32f2f;
		font-size: 0.85rem;
		flex: 1;
	}
</style>
