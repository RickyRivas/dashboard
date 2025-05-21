<script lang="ts">
	import AddSiteForm from '$lib/components/sites/AddSiteForm.svelte';
	import SitesList from '$lib/components/sites/SitesList.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let sites = $state(data.sites);
</script>

<section>
	<div class="container">
		<h1>Sites</h1>
		{#if sites.length}
			<SitesList {sites} />
		{:else}
			<p>No sites. Go make some sales!!!</p>
		{/if}
	</div>
</section>

<section>
	<div class="container">
		<h2>Add a site</h2>
		<AddSiteForm {sites} />
	</div>
</section>
