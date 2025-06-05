<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
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
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading={site.site_name}>
				<a href="/app/sites/{site.id}" class="btn">Overview</a>
			</Card>
			{#if siteContacts}
				<Card heading={'Contacts'}>
					<Form
						name="site contacts form"
						classes={['default-styling', 'child-form']}
						config={contactsConfig}
						triggerUpdate={contactsFormHandler}
					/>
				</Card>
			{/if}
			{#if siteInformation}
				<Card heading={'Contacts'}>
					<Form
						name="site info form"
						classes={['default-styling', 'child-form']}
						config={infoConfig}
						triggerUpdate={infoFormHandler}
					/>
				</Card>
			{/if}
			{#if siteChecklist}
				<Card heading={'Checklist'}>
					<AutoFormGroup
						name="site checklist form group"
						classes={['auto-form-group', 'child-form']}
						config={checklistConfig}
						triggerUpdate={checklistFormHandler}
					/>
				</Card>
			{/if}
		</CardGroup>
	</div>
</section>
