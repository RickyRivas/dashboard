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

<section class="sidebar-content-layout">
	<div class="container">
		<aside>
			<h2>Categories</h2>
			<div class="overflow-container">
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
		</aside>

		<div class="content">
			<h1>Components</h1>
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
				<hr />
			{/each}
		</div>
	</div>
</section>
