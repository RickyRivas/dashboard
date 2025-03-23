<script lang="ts">
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import { getBreadcrumbs, type RouteInfo } from '$lib/navigation';
	import { page } from '$app/state';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let assetType = 'Components';
	let { data }: PageProps = $props();
	const catsAndCounts = $derived(data.catsAndCounts);
	const codeAssetsGroups = $derived(groupByCategory(data.codeAssets));

	const parentRoute = getBreadcrumbs(page.url.pathname)[0];
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
