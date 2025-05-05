<script lang="ts">
	import SnippetCard from '$lib/components/code/SnippetCard.svelte';
	import { extractFavorites, groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';

	let { data }: PageProps = $props();
	const codeAssetsGroups = groupByCategory(data.codeAssets);
	const favorites = extractFavorites(data.codeAssets) || [];
</script>

<section>
	<div class="container">
		<h1>Snippets</h1>
		<CardGroup>
			<Card heading="Favorites">
				{#if favorites.length > 0}
					<ul class="code-asset-snippet-group">
						{#each favorites as codeAsset}
							<SnippetCard {codeAsset} minimize={true} />
						{/each}
					</ul>
				{/if}
			</Card>

			{#each codeAssetsGroups as group}
				<Card heading={group.category}>
					<ul class="code-asset-snippet-group">
						{#each group.codeAssets as codeAsset}
							<SnippetCard {codeAsset} />
						{/each}
					</ul>
				</Card>
			{/each}
		</CardGroup>
	</div>
</section>
