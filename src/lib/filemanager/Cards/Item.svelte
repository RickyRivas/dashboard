<script>
	import { getContext } from 'svelte';

	let { item } = $props();

	const api = getContext('filemanager-store');
	const _ = getContext('wx-i18n').getGroup('filemanager');
	const templates = getContext('filemanager-store').templates;

	let { panels, activePanel, mode } = api.getReactiveState();

	const selection = $derived($panels[$activePanel].selected);

	let preview = $derived(templates.preview(item, 214, 163));
	let icon = $derived(templates.icon(item, 'big'));

	const displayExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
</script>

{#if item.id == '/wx-filemanager-parent-link'}
	{#if $mode !== 'search'}
		<div class="wx-back-item">
			<div
				class="wx-back"
				data-id="/wx-filemanager-parent-link"
				class:wx-selected={item.navigation}
			>
				<i class="wxi-arrow-left"></i>
				<span> {_('Back to parent folder')}</span>
			</div>
		</div>
	{/if}
{:else}
	<div
		class="wx-item"
		class:wx-selected={selection?.length && selection.indexOf(item.id) >= 0}
		data-id={item.id}
	>
		{#if preview}
			<div class="wx-preview wx-file-preview">
				<img class="wx-card-preview" alt={_('A miniature file preview')} src={preview} />
			</div>
			<!-- special local path for contracting work -->
		{:else if item.localHostPath && item.ext && displayExts.includes(item.ext.toLowerCase())}
			<div class="wx-preview">
				<img class="wx-file-preview-img" alt="" src={item.localHostPath} />
				{#if item.imageDimensions}
					<div class="wx-preview-mod">
						<span>D: {item.imageDimensions.width} x {item.imageDimensions.height}</span>
						<span>S: {item.imageDimensions.size}</span>
					</div>
				{/if}
			</div>
		{:else if icon}
			<div class="wx-preview wx-file-icon">
				<img class="wx-card-preview" alt="" src={icon} />
			</div>
		{:else}
			<div class="wx-preview"><i class="wxi-{item.type}"></i></div>
		{/if}
		{#if item.type === 'folder'}
			<div class="wx-info">
				<div class="wx-folder-name">
					<span class="wx-type">{_('Folder')}</span>
					<span class="wx-name">{item.name}</span>
				</div>
				<div data-action-id={item.id} class="wx-more">
					<i class="wxi-dots-v"></i>
				</div>
			</div>
		{:else}
			<div class="wx-info">
				<div class="wx-file-name">
					<span class="wx-name">{item.name}</span>
				</div>
				<div data-action-id={item.id} class="wx-more">
					<i class="wxi-dots-v"></i>
				</div>
			</div>
		{/if}
	</div>
{/if}
