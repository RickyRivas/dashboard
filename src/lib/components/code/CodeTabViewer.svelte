<script lang="ts">
	// be able to display 3 langs of code from a snippet, section, or component
	import type { CodeAsset } from '$lib/types';
	import ToggleFavorite from './ToggleFavorite.svelte';
	import CodeDisplayPanel from './CodeDisplayPanel.svelte';
	let { codeAsset }: { codeAsset: CodeAsset } = $props();
</script>

<div class="code-tab-viewer" data-id={codeAsset.id}>
	<h2>{codeAsset.title}</h2>
	<p>{codeAsset.description || 'No description.'}</p>
	<ToggleFavorite id={codeAsset.id} favorite={codeAsset.favorite} />
	<CodeDisplayPanel {codeAsset} />
	<a href="/app/manager?code_asset_id={codeAsset.id}" class="btn">Edit</a>
</div>

<style lang="less">
	.code-tab-viewer {
		display: flex;
		flex-direction: column;
		gap: 1em;
		width: 100%;
		border: 1px solid var(--border-color);
		padding: 1em;
		text-align: left;
		border-radius: var(--border-radius);

		h2,
		p {
			margin: 0;
		}
	}
</style>
