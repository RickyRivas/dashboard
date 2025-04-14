<script lang="ts">
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import { page } from '$app/state';

	let assetType = 'Components';
	let { data }: PageProps = $props();
	const catsAndCounts = data.catsAndCounts;
	const codeAssetsGroups = $derived(groupByCategory(data.codeAssets));
</script>

<section>
	<div class="container">
		<h2>Categories</h2>
		<ul class="categories-list">
			{#each catsAndCounts as { category, count }}
				<li>
					<a
						class="btn"
						class:active={page.url.pathname.startsWith(`/app/components/${category}`)}
						href="/app/components/{category}">{category} ({count})</a
					>
				</li>
			{:else}
				<p>No categories</p>
			{/each}
		</ul>
	</div>
</section>

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
