<script lang="ts">
	import CopyButton from '../code/CopyButton.svelte';
	import IframePreview from './IframePreview.svelte';
	import MultiPanelEditor from './MultiPanelEditor.svelte';
	import UIblockEditor from './UIblockEditor.svelte';

	let { asset } = $props();

	// toolbar
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

	let activeToolbarTabId = $state(1);
</script>

<div class="ui-block">
	<h2>{asset.title}</h2>
	<p>{asset.description || 'No description.'}</p>

	<div class="toolbar">
		<div class="toolbar__tabs">
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

		<div class="toolbar__controls">
			<a href="/" class="btn">Live Demo</a>
			<a href="/" class="btn">Figma</a>
		</div>
	</div>

	<div class="tabpanels">
		{#if activeToolbarTabId === 1}
			<!-- Live Preview -->
			<IframePreview />
		{:else if activeToolbarTabId === 2}
			<!-- Code Panel -->
			<MultiPanelEditor html={asset.html} css={asset.css} javascript={asset.javascript} />
		{/if}
	</div>
</div>

<style lang="less">
	.ui-block {
		display: block;
		width: 100%;
		outline: 1px solid red;

		.toolbar {
			// background-color: slateblue;
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin-bottom: 1em;
			&__tabs {
			}
		}

		.tabpanels {
			background-color: slateblue;
			outline: 1px solid red;
			min-height: 300px;
		}
	}
</style>
