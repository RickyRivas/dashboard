<script lang="ts">
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { FileItem } from '$lib/types';
	import type { PageProps } from '../$types';

	let { data }: PageProps = $props();
	const { imgsData, account } = data;

	let showModal = $state(false);
	let selectedImage = $state() as FileItem;

	let imagesDirectory = $state();
	let currentDirectory = $state();

	if (imgsData) {
		imagesDirectory = imgsData.imagesDirectory;
		currentDirectory = imgsData.imagesDirectory;
	}

	function findFolder(targetPath) {
		// Recursive function to search through the tree
		function search(currentObj) {
			if (currentObj.path === targetPath) return currentObj;

			if (currentObj?.children?.length) {
				for (const child of currentObj.children) {
					if (child?.path === targetPath) {
						return child;
					}

					const result = search(child);
					if (result) return result;
				}
			}
		}

		return search(imagesDirectory);
	}

	let refreshing = $state(false);
	let refreshed = $state(false);
	let refreshError = $state(false);

	async function refresh() {
		if (!account) return;
		let refreshing = true;
		let refreshed = false;

		const response = await fetch('/api/get-local-imgs', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ account })
		});

		const data = await response.json();

		if (data) {
			imagesDirectory = data.imagesDirectory;

			// return to same folder
			currentDirectory = findFolder(currentDirectory.path);
		}

		refreshing = false;
		refreshed = true;
	}

	let optimizing = $state(false);
	let optimizeSuccess = $state(false);
	let optimizeError = $state(false);

	async function optimizeFolder() {
		if (!currentDirectory) return;
		optimizing = true;

		const response = await fetch('/api/sharp-optimize', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ folder: currentDirectory })
		});

		const data = await response.json();
		optimizing = false;

		if (data.status === 200) {
			optimizeSuccess = true;
			refresh();
		} else {
			optimizeError = true;
		}

		setTimeout(() => {
			optimizeError = false;
			optimizeSuccess = false;
		}, 1000);
	}

	let deleting = $state(false);
	let deleteSuccess = $state(false);
	let deleteError = $state(false);

	async function deleteFileOrFolder(systemPath: string) {
		if (!currentDirectory) return;

		const confirm = prompt(`are you sure?`);
		if (!confirm) return;

		deleting = true;

		const response = await fetch('/api/delete-item', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ systemPath })
		});

		const data = await response.json();
		deleting = false;

		if (data.success) {
			deleteSuccess = true;
			refresh();
		} else {
			deleteError = true;
		}

		setTimeout(() => {
			deleteError = false;
			deleteSuccess = false;
		}, 1000);
	}
</script>

<section>
	<div class="container">
		<h1>Image Builder</h1>
		<p>Only works locally. Dynamically generate image markup and batch optimize images.</p>

		<h2>Viewing {currentDirectory?.name || 'All folders'}</h2>
		{#if imagesDirectory && currentDirectory}
			<div class="imgs-builder-btns">
				{#if imagesDirectory.name !== currentDirectory.name}
					<button
						class="btn"
						onclick={() => {
							currentDirectory = findFolder(currentDirectory.parentPath);
						}}
					>
						Go Back
					</button>
				{/if}
				<button class="btn" onclick={refresh}>
					{#if refreshing}
						<LoadingSpinner
							loading={refreshing}
							error={refreshError}
							success={refreshed}
							dim={44}
						/>
					{:else}
						Refresh
					{/if}
				</button>
				<button class="btn" onclick={optimizeFolder}>
					{#if optimizing}
						<LoadingSpinner
							loading={optimizing}
							error={optimizeError}
							success={optimizeSuccess}
							dim={44}
						/>
					{:else}
						Run Batch Optimization
					{/if}
				</button>
			</div>

			<div class="imgs-builder-grid">
				{#if currentDirectory.children && currentDirectory.children.length > 0}
					{#each currentDirectory.children as child}
						<!-- list files -->
						{#if child.type === 'file'}
							<div class="images-grid-item">
								{#if child?.dimensions?.type && child.siteManagerLocalHostURL}
									<img src={child.siteManagerLocalHostURL} alt="" width="" />
								{/if}
								<div class="info">
									<p>{child.base}</p>
									{#if child.dimensions && child.dimensions.width && child.dimensions.height}
										<p>{child.dimensions.width + 'px'} x {child.dimensions.height + 'px'}</p>
									{/if}
									{#if child.size}
										<p>{child.size}</p>
									{/if}
								</div>
								<div class="images-grid-item__mod">
									{#if child?.dimensions?.type && child?.siteManagerLocalHostURL}
										<button
											class="btn"
											onclick={() => {
												selectedImage = child;
												showModal = true;
											}}
										>
											View
										</button>
									{/if}
									<button
										class="btn"
										onclick={() => {
											deleteFileOrFolder(child.path);
										}}
									>
										Delete
									</button>
								</div>
							</div>
						{/if}

						<!-- list folders -->
						{#if child.type === 'directory'}
							<div
								class="images-grid-item images-grid-item--folder"
								class:images-grid-item--disabled={!child.children.length}
							>
								<div class="images-grid-item__mod">
									<button
										class="btn"
										disabled={!child.children.length}
										onclick={() => {
											currentDirectory = child;
										}}
									>
										View
									</button>
									<button
										class="btn"
										onclick={() => {
											deleteFileOrFolder(child.path);
										}}
									>
										Delete
									</button>
								</div>
								<div class="info">
									<p>{child.name} ({child.children.length})</p>
								</div>
								<svg
									class="folder-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="44"
									height="44"
									fill="none"
									viewBox="0 0 44 44"
								>
									<path
										fill="currentColor"
										d="M5.5 41.25h33c3.034 0 5.5-2.466 5.5-5.5v-22c0-3.034-2.466-5.5-5.5-5.5H24.75a2.731 2.731 0 0 1-2.2-1.1l-1.65-2.2a5.51 5.51 0 0 0-4.4-2.2h-11A5.505 5.505 0 0 0 0 8.25v27.5c0 3.034 2.466 5.5 5.5 5.5Z"
									/>
								</svg>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
		<!-- 2nd layout-->
	</div>
</section>

{#if showModal}
	<Modal
		closeModal={() => {
			selectedImage = '';
			showModal = false;
		}}
	>
		{#snippet modalContent()}
			<ModalImageBuilder img={selectedImage} />
		{/snippet}
	</Modal>
{/if}

<style lang="less">
	.imgs-builder-grid {
		list-style: none;
		display: grid;
		gap: 1em;
		grid-template-columns: repeat(2, 1fr);

		@media only screen and (min-width: 768px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media only screen and (min-width: 1024px) {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.folder-btn {
		width: 100%;
		aspect-ratio: ~'1 / 1';
		position: relative;
		z-index: 1;
		color: var(--text);
		background: none;
		text-transform: uppercase;
		line-height: 1.2;
		padding-top: 1.75em;
		border: none;

		&:disabled {
			svg {
				color: #ccc;
			}
		}
	}
	.imgs-builder-btns {
		margin-bottom: 1em;
	}

	.images-grid-item {
		width: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border-color);
		position: relative;
		background: none;
		aspect-ratio: ~'1 / 1';
		font: inherit;
		max-width: 330px;

		&--folder {
			border: none;
		}

		&__mod {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 7;
			// text-align: center;
			padding: 10px;
		}

		svg {
			color: var(--secondary);
			width: 100%;
		}

		img {
			width: auto;
			height: auto;
			max-width: 100%;
			max-height: 100%;
			display: block;
		}

		.info {
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			flex-wrap: wrap;
			background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%);
			text-align: left;
			padding: 1em;
			font-size: 14px;

			p {
				color: #fff;
				margin: 0;
			}
		}
	}
</style>
