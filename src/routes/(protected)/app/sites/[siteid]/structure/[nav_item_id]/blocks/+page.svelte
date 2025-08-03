<script lang="ts">
	import type { Site, SiteNavigationItem } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const navItem = $state(data.navItem) as SiteNavigationItem;
	const site = $state(data.site) as Site;

	let pageBlocks = $state([]);
</script>

<section>
	<div class="container">
		<h1>{site.site_name} Page Blocks</h1>
		<p>Define the layout of a page.</p>
		{#if pageBlocks.length}
			<ul>
				{#each pageBlocks as block}
					<li></li>
				{/each}
			</ul>
		{:else}
			<p>No blocks available.</p>
		{/if}
	</div>
</section>

<section>
	<div class="container">
		<h2>Add an available block</h2>
	</div>
</section>
