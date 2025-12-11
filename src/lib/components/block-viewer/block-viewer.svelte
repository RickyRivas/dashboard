<script lang="ts">
	import BlockViewerCode from './block-viewer-code.svelte';
	import BlockViewerIframe from './block-viewer-iframe.svelte';
	let { asset } = $props();

	// toolbar
	let activeToolbarTabId = $state(1);
	let toolbarTabs = [
		{
			id: 1,
			textContent: 'Preview'
		},
		{
			id: 2,
			textContent: 'Code'
		}
	];
</script>

<div class="block-viewer">
	<h2>{asset.title}</h2>
	<p>{asset.description || 'No description.'}</p>

	<div class="block-viewer__toolbar">
		<div class="block-viewer__toolbar-tabs">
			{#each toolbarTabs as tab (tab.id)}
				<button
					class="btn"
					class:active={activeToolbarTabId === tab.id}
					onclick={() => {
						if (activeToolbarTabId === tab.id) return;
						activeToolbarTabId = tab.id;
					}}>{tab.textContent}</button
				>
			{/each}
		</div>

		<div class="block-viewer__controls">
			<a href="/app/manager?code_asset_id={asset.id}" class="btn">Edit</a>
		</div>
	</div>

	<div class="block-viewer__tabpanels">
		{#if activeToolbarTabId === 1}
			<!-- Iframe Viewer -->
			<BlockViewerIframe {asset} />
		{:else if activeToolbarTabId === 2}
			<!-- Code Panel -->
			<BlockViewerCode html={asset.html} css={asset.css} javascript={asset.javascript} />
		{/if}
	</div>
</div>
