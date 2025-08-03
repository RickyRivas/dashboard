<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import type { Site, SiteNavigationItem } from '$lib/types';
	import type { PageData } from '../seo/$types';
	import { updateNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-page';
	import { updateFolderNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-folder';
	import { updateLinkNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-link';

	let { data }: { data: PageData } = $props();
	const navItem = $state(data.navItem) as SiteNavigationItem;
	const site = $state(data.site) as Site;

	// conditional form - page config by default
	let updateNavItemConfig = $state(updateNavItemFormConfig);

	// folder
	if (navItem.navigation_item_type === 'folder')
		updateNavItemConfig = updateFolderNavItemFormConfig;

	// link
	if (navItem.navigation_item_type === 'link') updateNavItemConfig = updateLinkNavItemFormConfig;

	const updateNavItemFormHandler = handleTriggerUpdate(updateNavItemConfig);
	if (navItem) updateConfigWithValues(updateNavItemConfig, navItem);
</script>

<section>
	<div class="container">
		<h2>Editing {navItem.title} ({navItem.navigation_item_type})</h2>
		<h3>Account: {site.site_name}</h3>
		<Form
			name="update nav item form"
			config={updateNavItemConfig}
			clearOnSuccess={false}
			triggerUpdate={updateNavItemFormHandler}
		/>
		<a href="/app/sites/{site.id}/structure" class="btn">View Site Structure</a>
	</div>
</section>
