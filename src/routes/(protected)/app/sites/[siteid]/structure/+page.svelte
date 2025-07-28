<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { createNavItemFormConfig } from '$lib/form-configs/app/create-nav-item';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import type { Site, SiteNavigationItem } from '$lib/types';
	import SiteStructureTreeEditor from '$lib/widgets/SiteStructureTreeEditor.svelte';
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
		<h1>{site.site_name} Sitemap</h1>
		<SiteStructureTreeEditor {pages} {site} onPagesTreeChange={(hasChanges, updatesCount) => {}} />
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
		<a href="/app/sites/{site.id}" class="btn">Site overview</a>
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
