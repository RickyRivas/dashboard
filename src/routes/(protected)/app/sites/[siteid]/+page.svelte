<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import SiteChecklist from '$lib/components/sites/SiteChecklist.svelte';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import { addPageFormConfig } from '$lib/forms/add-page';
	import { contactsFormConfig } from '$lib/forms/sites-contacts-form';
	import { siteInfoFormConfig } from '$lib/forms/sites-info.form';

	import type {
		Site,
		SiteContacts,
		SiteInformation,
		SitePage,
		SiteProcessChecklist
	} from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site,
		site_pages,
		site_contacts,
		site_information,
		site_checklist
	}: {
		site: Site;
		site_pages: SitePage[];
		site_contacts: SiteContacts;
		site_information: SiteInformation;
		site_checklist: SiteProcessChecklist;
	} = data;

	// forms
	// 1. Contacts
	let contactsConfig = $state(contactsFormConfig);
	const contactsFormHandler = handleTriggerUpdate(contactsConfig);
	if (site_contacts) updateConfigWithValues(contactsConfig, site_contacts);

	// 2. Information
	let infoConfig = $state(siteInfoFormConfig);
	const infoFormHandler = handleTriggerUpdate(infoConfig);
	if (site_information) updateConfigWithValues(infoConfig, site_information);

	// Add Page
	let addPageConfig = $state(addPageFormConfig);
	const addPageFormHandler = handleTriggerUpdate(addPageConfig);
</script>

<section>
	<div class="container">
		<h1>Account: {site.site_name}</h1>
		<hr />

		<h2>Contact Info:</h2>
		{#if site_contacts}
			<Form name="site contacts form" config={contactsConfig} triggerUpdate={contactsFormHandler} />
		{:else}
			<p>Site contacts unavailable.</p>
		{/if}
		<hr />

		<h2>Site Information:</h2>
		{#if site_information}
			<Form name="site info form" config={infoConfig} triggerUpdate={infoFormHandler} />
		{:else}
			<p>Site information unavailable.</p>
		{/if}
		<hr />

		<h2>Site Checklist</h2>
		{#if site_checklist}
			<!-- <SiteChecklist {site_checklist} /> -->
		{:else}
			<p>Site checklist unavailable.</p>
		{/if}
		<hr />

		<h2>Pages</h2>
		<p>All <a href="/app/sites/{site.id}/pages">pages</a> for {site.site_name}</p>
		{#if site_pages.length}
			<ul>
				{#each site_pages as page}
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
		<Form name="add page form" config={addPageConfig} triggerUpdate={addPageFormHandler} />
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
