<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import { addPageFormConfig } from '$lib/form-configs/app/add-page';
	import { contactsFormConfig } from '$lib/form-configs/app/sites-contacts';
	import { siteInfoFormConfig } from '$lib/form-configs/app/sites-info';
	import { siteChecklistConfig } from '$lib/auto-form-configs/site-checklist';

	import type {
		Site,
		SiteContacts,
		SiteInformation,
		SitePage,
		SiteProcessChecklist
	} from '$lib/types';
	import type { PageData } from './$types';
	import AutoFormGroup from '$lib/components/auto-form/AutoFormGroup.svelte';
	let { data }: { data: PageData } = $props();

	const {
		site,
		sitePages,
		siteContacts,
		siteInformation,
		siteChecklist
	}: {
		site: Site;
		sitePages: SitePage[] | undefined;
		siteContacts: SiteContacts | undefined;
		siteInformation: SiteInformation | undefined;
		siteChecklist: SiteProcessChecklist | undefined;
	} = data;

	// forms
	// 1. Contacts
	let contactsConfig = $state(contactsFormConfig);
	const contactsFormHandler = handleTriggerUpdate(contactsConfig);
	if (siteContacts) updateConfigWithValues(contactsConfig, siteContacts);

	// 2. Information
	let infoConfig = $state(siteInfoFormConfig);
	const infoFormHandler = handleTriggerUpdate(infoConfig);
	if (siteInformation) updateConfigWithValues(infoConfig, siteInformation);

	// 3. checklist
	let checklistConfig = $state(siteChecklistConfig);
	const checklistFormHandler = handleTriggerUpdate(checklistConfig);
	if (siteChecklist) updateConfigWithValues(checklistConfig, siteChecklist);

	// 4. Add Page
	let addPageConfig = $state(addPageFormConfig);
	const addPageFormHandler = handleTriggerUpdate(addPageConfig);
</script>

<section>
	<div class="container">
		<h1>Account: {site.site_name}</h1>
		<hr />

		<h2>Contact Info:</h2>
		{#if siteContacts}
			<Form name="site contacts form" config={contactsConfig} triggerUpdate={contactsFormHandler} />
		{:else}
			<p>Site contacts unavailable.</p>
		{/if}
		<hr />

		<h2>Site Information:</h2>
		{#if siteInformation}
			<Form name="site info form" config={infoConfig} triggerUpdate={infoFormHandler} />
		{:else}
			<p>Site information unavailable.</p>
		{/if}
		<hr />

		<h2>Site Checklist</h2>
		{#if siteChecklist}
			<AutoFormGroup
				name="site checklist form group"
				config={checklistConfig}
				triggerUpdate={checklistFormHandler}
			/>
		{:else}
			<p>Site checklist unavailable.</p>
		{/if}
		<hr />

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
