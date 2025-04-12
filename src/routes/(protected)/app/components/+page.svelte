<script lang="ts">
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	let assetType = 'Components';
	const { codeAssets } = data;
	const codeAssetsGroups = groupByCategory(codeAssets);
</script>

<section>
	<div class="container">
		<h2>All {assetType}</h2>
		{#if codeAssetsGroups.length > 0}
			{#each codeAssetsGroups as group}
				<h2>{group.category}</h2>
				<ul class="code-asset-links">
					{#each group.codeAssets as codeAsset}
						<CodeAssetLink
							href={`/app/components/${codeAsset.category}/${codeAsset.id}`}
							{codeAsset}
						/>
					{/each}
				</ul>
			{/each}
		{:else}
			<p>No {assetType}.</p>
		{/if}
	</div>
</section>
