<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import ContactsForm from '$lib/components/sites/ContactsForm.svelte';
	import InformationForm from '$lib/components/sites/InformationForm.svelte';
	import SiteChecklist from '$lib/components/sites/SiteChecklist.svelte';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import { addPageFormConfig } from '$lib/forms/add-page';

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

	let addPageConfig = $state(addPageFormConfig);
	const triggerUpdateHandler = handleTriggerUpdate(addPageConfig);
</script>

<section>
	<div class="container">
		<h1>Account: {site.site_name}</h1>
		<hr />

		<h2>Contact Info:</h2>
		{#if site_contacts}
			<ContactsForm {site_contacts} />
		{:else}
			<p>Site contacts unavailable.</p>
		{/if}
		<hr />

		<h2>Site Information:</h2>
		{#if site_information}
			<InformationForm {site_information} />
		{:else}
			<p>Site information unavailable.</p>
		{/if}
		<hr />

		<h2>Site Checklist</h2>
		{#if site_checklist}
			<SiteChecklist {site_checklist} />
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
		<Form name="add page form" config={addPageConfig} triggerUpdate={triggerUpdateHandler} />
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
