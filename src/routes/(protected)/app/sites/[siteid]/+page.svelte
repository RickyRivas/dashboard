<script lang="ts">
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';

	import type {
		Site,
		SiteContacts,
		SiteInformation,
		SitePage,
		SiteProcessChecklist
	} from '$lib/types';
	import type { PageData } from './$types';
	import AutoFormGroup from '$lib/components/auto-form/AutoFormGroup.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';
	import { siteOverviewFormConfig } from '$lib/form-configs/app/site-overview';
	import DisplayForm from '$lib/components/display-form/DisplayForm.svelte';
	import { removeSiteFormConfig } from '$lib/form-configs/app/remove-site';
	import Form from '$lib/components/form/Form.svelte';
	let { data }: { data: PageData } = $props();

	const {
		site,
		siteContacts,
		siteInformation,
		siteChecklist
	}: {
		site: Site;
		siteContacts: SiteContacts | undefined;
		siteInformation: SiteInformation | undefined;
		siteChecklist: SiteProcessChecklist | undefined;
	} = data;

	// overview
	let overviewConfig = $state(siteOverviewFormConfig);
	updateConfigWithValues(overviewConfig, site);
	if (siteContacts) updateConfigWithValues(overviewConfig, siteContacts);
	if (siteInformation) updateConfigWithValues(overviewConfig, siteInformation);

	let deleteConfig = $state(removeSiteFormConfig);
	const deleteFormHandler = handleTriggerUpdate(deleteConfig);
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading="Overview">
				<DisplayForm
					name="site overview"
					classes={['display-form', 'child-form', 'margin-bottom-1em']}
					config={overviewConfig}
				/>
				<a href="/app/sites" class="btn">View all accounts</a>
				<a href="/app/sites/{site.id}/configuration" class="btn">Site Configuration</a>
				<a href="/app/sites/{site.id}/structure" class="btn">Site Structure</a>
			</Card>
			<Card heading="Danger">
				<Form
					name="delete account form"
					classes={['default-styling', 'child-form']}
					config={deleteConfig}
					triggerUpdate={deleteFormHandler}
				/>
			</Card>
		</CardGroup>
	</div>
</section>
