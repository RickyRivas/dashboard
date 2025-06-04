<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import SitesList from '$lib/components/sites/SitesList.svelte';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import { addSiteFormConfig } from '$lib/forms/add-site-form';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let sites = $state(data.sites);

	let addSiteConfig = $state(addSiteFormConfig);
	const addSiteFormHandler = handleTriggerUpdate(addSiteConfig);
</script>

<section>
	<div class="container">
		<h1>Sites</h1>
		{#if sites.length}
			<SitesList bind:sites />
		{:else}
			<p>No sites. Go make some sales!!!</p>
		{/if}
	</div>
</section>

<section>
	<div class="container">
		<h2>Add a site</h2>
		<Form name="add site form" config={addSiteConfig} triggerUpdate={addSiteFormHandler} />
	</div>
</section>
