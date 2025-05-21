<script lang="ts">
	import ContactsForm from '$lib/components/sites/ContactsForm.svelte';
	import InformationForm from '$lib/components/sites/InformationForm.svelte';
	import SiteChecklist from '$lib/components/sites/SiteChecklist.svelte';
	import type { Site, SiteContacts, SiteInformation, SiteProcessChecklist } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site,
		site_contacts,
		site_information,
		site_checklist
	}: {
		site: Site;
		site_contacts: SiteContacts;
		site_information: SiteInformation;
		site_checklist: SiteProcessChecklist;
	} = data;
</script>

<section>
	<div class="container">
		<h2>Account: {site.site_name}</h2>
		<hr />

		<h3>Contact Info:</h3>
		{#if site_contacts}
			<ContactsForm {site_contacts} />
		{:else}
			<p>Site contacts unavailable.</p>
		{/if}
		<hr />

		<h3>Site Information:</h3>
		{#if site_information}
			<InformationForm {site_information} />
		{:else}
			<p>Site information unavailable.</p>
		{/if}
		<hr />

		<h3>Site Checklist</h3>
		{#if site_checklist}
			<SiteChecklist {site_checklist} />
		{:else}
			<p>Site checklist unavailable.</p>
		{/if}
		<hr />

		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
