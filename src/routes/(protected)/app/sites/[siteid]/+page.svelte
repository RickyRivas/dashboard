<script lang="ts">
	import ContactsForm from '$lib/components/sites/ContactsForm.svelte';
	import InformationForm from '$lib/components/sites/InformationForm.svelte';
	import type { Site, SiteContacts, SiteInformation } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const {
		site,
		site_contacts,
		site_information
	}: { site: Site; site_contacts: SiteContacts; site_information: SiteInformation } = data;
</script>

<section>
	<div class="container">
		<h2>Account: {site.site_name}</h2>
		<hr />
		<h3>Contact Info:</h3>
		<ContactsForm {site_contacts} />
		<hr />
		<h4>Site Information:</h4>
		<InformationForm {site_information} />
		<hr />
		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
