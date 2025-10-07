<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import CodeAssetLink from '$lib/components/code/CodeAssetLink.svelte';
	import SnippetCard from '$lib/components/code/SnippetCard.svelte';
	import RenderComponent from '$lib/render/RenderComponent.svelte';
	import { hardCodedFavorites } from '$lib/snippets.js';

	type libraryType = 'snippet' | 'section' | 'component';

	const { data } = $props();

	let selectedType = $derived(data.type) as libraryType;
	let selectedTypeCategories = $derived(data.categories);
	let selectedTypeCategory = $derived(data.category);
	let codeAssets = $derived(data.assets);

	console.log(codeAssets);

	// const favorites = $derived(data.favorites);
	const favorites = hardCodedFavorites;

	function handleTypeChange(e) {
		const newType = e.target.value;
		const params = new URLSearchParams(page.url.searchParams);
		params.set('type', newType);
		params.delete('category'); // Reset category when type changes
		goto(`/app/library?${params}`, { replaceState: true });
	}

	function handleCategoryChange(e) {
		const newCategory = e.target.value;
		const params = new URLSearchParams(page.url.searchParams);
		params.set('category', newCategory);
		goto(`/app/library?${params}`, { replaceState: true });
	}

	const commonAssets = [
		{
			name: 'fontawesome',
			category: 'fa',
			type: 'snippet'
		},
		{
			name: 'Spotbtns',
			category: 'spotbtn',
			type: 'component'
		},
		{
			name: 'Heading',
			category: 'heading',
			type: 'component'
		},
		{
			name: 'Callouts',
			category: 'callouts',
			type: 'section'
		}
	];
</script>

<section>
	<div class="container">
		<h1>Library</h1>
		<p>libary for our snippets, components, and sections.</p>

		<CardGroup>
			<Card heading="Favorites">
				{#if favorites && favorites.length > 0}
					<ul class="code-asset-snippet-group">
						{#each favorites as codeAsset}
							<SnippetCard {codeAsset} minimize={true} />
						{/each}
					</ul>
				{/if}
			</Card>
			<Card heading="Filters">
				<!-- filters -->
				<div class="filters">
					<div class="filters__item">
						<h2>Select a library type</h2>
						<div class="form-control">
							<select name="type" id="type" bind:value={selectedType} onchange={handleTypeChange}>
								{#each ['snippet', 'section', 'component'] as type}
									<option value={type}>{type}</option>
								{/each}
							</select>
						</div>
					</div>

					<div class="filters__item">
						<h2>Select a {selectedType} category:</h2>
						{#if selectedTypeCategories.length}
							<div class="form-control">
								<select
									name="category"
									id="category"
									bind:value={selectedTypeCategory}
									onchange={handleCategoryChange}
								>
									{#each selectedTypeCategories as category}
										<option value={category}>{category}</option>
									{/each}
								</select>
							</div>
						{:else}
							<p>No categories for {selectedType}</p>
						{/if}
					</div>
				</div>
			</Card>

			{#if commonAssets && commonAssets.length}
				<Card heading="Common">
					<div class="common-btns">
						{#each commonAssets as { type, category, name }}
							<a
								href="/app/library?type={type}&category={category}"
								class:active={category === selectedTypeCategory || type === selectedTypeCategory}
								class="btn"
							>
								{name}
							</a>
						{/each}
					</div>
				</Card>
			{/if}

			<Card heading="Assets:">
				<!-- TODO: SIMPLIFY -->
				{#if codeAssets && codeAssets.length > 0}
					{#if selectedType === 'snippet'}
						<ul class="code-asset-snippet-group">
							{#each codeAssets as asset}
								<SnippetCard codeAsset={asset} />
							{/each}
						</ul>
					{:else if selectedType === 'component'}
						<ul class="code-asset-snippet-group">
							{#each codeAssets as asset}
								<RenderComponent code={asset} />
							{/each}
						</ul>
					{:else}
						<ul class="code-asset-links">
							{#each codeAssets as asset}
								<CodeAssetLink
									href={`/app/sections/${asset.category}/${asset.id}`}
									codeAsset={asset}
								/>
							{/each}
						</ul>
					{/if}
				{:else}
					<p>No assets found.</p>
				{/if}
			</Card>
		</CardGroup>
	</div>
</section>

<style lang="less">
	.filters {
		display: flex;
		gap: 1em;
		margin-bottom: 1em;

		&__item {
			width: 100%;
		}
	}

	.library-list {
		border: 1px solid var(--primary);
		background-color: var(--secondary);
		padding: 1em;
		border-radius: var(--border-radius);
	}

	.common-btns {
		display: flex;
		gap: 1em;
	}
</style>
