<script lang="ts">
	import CodeAssetCard from '$lib/components/code/CodeAssetCard.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { extractFavorites, groupByCategory } from '$lib/utils';
	import type { CodeAsset } from '$lib/types';
	import type { PageProps } from './$types';
	import CodeTabViewer from '$lib/components/code/CodeTabViewer.svelte';

	let { data }: PageProps = $props();
	const codeAssetsGroups = groupByCategory(data.codeAssets);
	const favorites = extractFavorites(data.codeAssets) || [];

	let currentlySelectedSnippet: CodeAsset | null = $state(null);
	let showModal = $state(false);
</script>

<section class="default-styling">
	<h1>Snippets</h1>
	{#if favorites.length > 0}
		<h2>Favorite Snippets</h2>
		{#each favorites as codeAsset}
			<CodeAssetCard
				{codeAsset}
				onViewSnippet={() => {
					currentlySelectedSnippet = codeAsset;
					showModal = true;
				}}
			/>
		{/each}
	{/if}

	<h2>All Snippets</h2>
	{#if codeAssetsGroups.length > 0}
		{#each codeAssetsGroups as group}
			<h2>{group.category}</h2>
			<ul>
				{#each group.codeAssets as codeAsset}
					<CodeAssetCard
						{codeAsset}
						onViewSnippet={() => {
							currentlySelectedSnippet = codeAsset;
							showModal = true;
						}}
					/>
				{/each}
			</ul>
		{/each}
	{:else}
		<p>No snippets.</p>
	{/if}
</section>

{#if showModal}
	<Modal
		closeModal={() => {
			currentlySelectedSnippet = null;
			showModal = false;
		}}
	>
		{#snippet modalContent()}
			<CodeTabViewer codeAsset={currentlySelectedSnippet} />
		{/snippet}
	</Modal>
{/if}
