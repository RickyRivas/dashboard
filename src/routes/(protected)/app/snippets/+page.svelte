<script lang="ts">
	import CodeAssetCard from '$lib/components/code/CodeAssetCard.svelte';
	import CodeTabViewer from '$lib/components/code/CodeTabViewer.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	import { extractFavorites, groupByCategory } from '$lib/utils';
	import type { CodeAsset } from '$lib/types';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const codeAssetsGroups = groupByCategory(data.codeAssets);
	const favorites = extractFavorites(data.codeAssets) || [];

	let assetType = 'Snippets';
	let currentlySelectedCodeAsset: CodeAsset | null = $state(null);
	let showModal = $state(false);
</script>

<section>
	<div class="container">
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
	</div>
</section>

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
