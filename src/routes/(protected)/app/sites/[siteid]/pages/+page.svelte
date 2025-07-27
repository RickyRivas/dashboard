<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { createNavItemFormConfig } from '$lib/form-configs/app/create-nav-item';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import type { Site, SiteNavigationItem } from '$lib/types';
	import PageTreeEditor from '$lib/widgets/PageTreeEditor.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { site, site_navigation } = data;

	// 4. Add Page
	let createNavItemConfig = $state(createNavItemFormConfig);
	const createNavItemFormHandler = handleTriggerUpdate(createNavItemConfig);

	// navigation
	let pages = $state(site_navigation);
</script>

<section>
	<div class="container">
		<h1>All sites Pages for {site.site_name}</h1>
		<a href="/app/sites/{site.id}" class="btn">Site overview</a>
	</div>
</section>

<section>
	<div class="container">
		<h2>Sitemap</h2>
		<PageTreeEditor {pages} {site} onPagesTreeChange={(hasChanges, updatesCount) => {}} />
		<h3>Add a Page, Folder, or Link to the Navigation</h3>
		<Form
			name="add nav item"
			clearOnSuccess={true}
			config={createNavItemConfig}
			triggerUpdate={createNavItemFormHandler}
			onSuccess={(result) => {
				if (result.type === 'success') {
					console.log(result);
					// 1. show success state
					// 2. update the nav
					const addedPage = result?.data?.addedPage;
					if (addedPage) {
						pages = [...pages, addedPage];
					}
				}
			}}
		/>
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
