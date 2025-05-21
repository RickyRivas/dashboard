<script lang="ts">
	import { fly } from 'svelte/transition';
	import RemoveSiteForm from './RemoveSiteForm.svelte';
	let { sites = $bindable() } = $props();
</script>

{#key sites}
	<ul>
		{#each sites as site (site.id)}
			<li transition:fly={{ x: 100 }}>
				<a class="btn" href="/app/sites/{site.id}">View {site.site_name} Account</a>
				<RemoveSiteForm {site} {sites} />
			</li>
		{/each}
	</ul>
{/key}
