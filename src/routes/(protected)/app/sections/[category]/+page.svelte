<script lang="ts">
	import { groupByCategory } from '$lib/utils';
	import type { PageProps } from './$types';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import { page } from '$app/state';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';
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
								class:active={page.url.pathname.startsWith(`/app/sections/${category}`)}
								href="/app/sections/{category}">{category} ({count})</a
							>
						</li>
					{:else}
						<p>No categories</p>
					{/each}
				</ul>
			</Card>

			<h1>Sections</h1>

			{#each codeAssetsGroups as group}
				<Card heading={group.category}>
					<ul class="code-asset-links">
						{#each group.codeAssets as codeAsset}
							<CodeAssetLink
								href={`/app/sections/${codeAsset.category}/${codeAsset.id}`}
								{codeAsset}
							/>
						{/each}
					</ul>
				</Card>
			{/each}
		</CardGroup>
	</div>
</section>
