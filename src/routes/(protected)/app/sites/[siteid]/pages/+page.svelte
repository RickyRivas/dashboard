<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { addPageFormConfig } from '$lib/form-configs/app/add-page';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import type { Site, SitePage } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site,
		sitePages
	}: {
		site: Site;
		sitePages: SitePage[] | undefined;
	} = data;

	// 4. Add Page
	let addPageConfig = $state(addPageFormConfig);
	const addPageFormHandler = handleTriggerUpdate(addPageConfig);
</script>

<section>
	<div class="container">
		<h1>All sites Pages for {site.site_name}</h1>
		<a href="/app/sites/{site.id}" class="btn">Site overview</a>
	</div>
</section>

<section>
	<div class="container">
		<h2>Pages</h2>
		<p>All <a href="/app/sites/{site.id}/pages">pages</a> for {site.site_name}</p>
		{#if sitePages?.length}
			<ul>
				{#each sitePages as page}
					<li>
						<h2>{page.title}</h2>
						<div>display order: {page.display_order}</div>
						<input type="text" value={page.display_order} />
						<div>parent id: {page.parent_id || 'Top Level. No Parent ID'}</div>
						<a href="/app/sites/{site.id}/pages/{page.id}">Edit page</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No pages.</p>
		{/if}

		<h3>Add a page</h3>
		<Form
			name="add page form"
			clearOnSuccess={true}
			config={addPageConfig}
			triggerUpdate={addPageFormHandler}
		/>
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
