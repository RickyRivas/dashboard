<script lang="ts">
	import { fly } from 'svelte/transition';
	import RemoveSiteForm from './RemoveSiteForm.svelte';
	import type { Site } from '$lib/types';
	let { sites = $bindable() }: { sites: Site[] } = $props();

	function removeSite(siteId: string) {
		const indexToRemove = sites.findIndex((site) => site.id === siteId);
		sites.splice(indexToRemove, 1);
	}
</script>

{#key sites}
	<ul>
		{#each sites as site (site.id)}
			<li transition:fly={{ x: 100 }}>
				<a class="btn" href="/app/sites/{site.id}">View {site.site_name} Account</a>
				<RemoveSiteForm {site} {removeSite} />
			</li>
		{/each}
	</ul>
{/key}
