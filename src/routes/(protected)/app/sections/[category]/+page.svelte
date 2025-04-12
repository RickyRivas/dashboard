<script lang="ts">
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';

	let assetType = 'Sections';
	let { data }: PageProps = $props();
	const codeAssetsGroups = $derived(groupByCategory(data.codeAssets));
</script>

<section>
	<div class="container">
		<h2>All Sections</h2>
		{#if codeAssetsGroups.length > 0}
			{#each codeAssetsGroups as group}
				<h2>{group.category}</h2>
				<ul class="code-asset-links">
					{#each group.codeAssets as codeAsset}
						<CodeAssetLink
							href={`/app/sections/${codeAsset.category}/${codeAsset.id}`}
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
