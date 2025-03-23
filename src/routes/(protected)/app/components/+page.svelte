<script lang="ts">
	import { page } from '$app/state';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	let assetType = 'Components';
	const { codeAssets, catsAndCounts } = data;
	const codeAssetsGroups = groupByCategory(codeAssets);

	const parentRoute = findRouteInfo(page.url.pathname)?.parent;
	const appRoutes = parentRoute?.children as RouteInfo[];
	let currentPagePath = $derived(page.url.pathname);
</script>

<main class="sidebar-content-layout">
	<Sidebar {parentRoute} routes={appRoutes} {currentPagePath} {catsAndCounts} />
	<div id="content">
		<section>
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
		</section>
	</div>
</main>
