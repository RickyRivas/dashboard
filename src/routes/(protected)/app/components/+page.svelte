<script lang="ts">
	import { page } from '$app/state';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	const catsAndCounts = data.catsAndCounts;
	const codeAssetsGroups = $derived(groupByCategory(data.codeAssets));
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading="Categories">
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
			</Card>

			<h1>Components</h1>

			{#each codeAssetsGroups as group}
				<Card heading={group.category}>
					<ul class="code-asset-links">
						{#each group.codeAssets as codeAsset}
							<CodeAssetLink
								href={`/app/components/${codeAsset.category}/${codeAsset.id}`}
								{codeAsset}
							/>
						{/each}
					</ul>
				</Card>
			{/each}
		</CardGroup>
	</div>
</section>
