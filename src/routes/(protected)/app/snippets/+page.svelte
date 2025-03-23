<script lang="ts">
	import CodeAssetCard from '$lib/components/code/CodeAssetCard.svelte';
	import CodeTabViewer from '$lib/components/code/CodeTabViewer.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	import { extractFavorites, groupByCategory } from '$lib/utils';
	import type { CodeAsset } from '$lib/types';
	import type { PageProps } from './$types';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	const codeAssetsGroups = groupByCategory(data.codeAssets);
	const favorites = extractFavorites(data.codeAssets) || [];

	let assetType = 'Snippets';
	let currentlySelectedCodeAsset: CodeAsset | null = $state(null);
	let showModal = $state(false);

	const parentRoute = findRouteInfo(page.url.pathname)?.parent;
	const appRoutes = parentRoute?.children as RouteInfo[];
	let currentPagePath = $derived(page.url.pathname);
</script>

<main class="sidebar-content-layout">
	<Sidebar {parentRoute} routes={appRoutes} {currentPagePath} />
	<div class="container">
		<section class="default-styling">
			<h1>{assetType}</h1>

			{#if favorites.length > 0}
				<h2>Favorite {assetType}</h2>
				{#each favorites as codeAsset}
					<CodeAssetCard
						{codeAsset}
						onViewSnippet={() => {
							currentlySelectedCodeAsset = codeAsset;
							showModal = true;
						}}
					/>
				{/each}
			{/if}

			<h2>All {assetType}</h2>
			{#if codeAssetsGroups.length > 0}
				{#each codeAssetsGroups as group}
					<h2>{group.category}</h2>
					<ul>
						{#each group.codeAssets as codeAsset}
							<CodeAssetCard
								{codeAsset}
								onViewSnippet={() => {
									currentlySelectedCodeAsset = codeAsset;
									showModal = true;
								}}
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

{#if showModal}
	<Modal
		closeModal={() => {
			currentlySelectedCodeAsset = null;
			showModal = false;
		}}
	>
		{#snippet modalContent()}
			<CodeTabViewer codeAsset={currentlySelectedCodeAsset} />
		{/snippet}
	</Modal>
{/if}
