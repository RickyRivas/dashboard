<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	const { children } = $props();
	import { getNavRoutes } from '$lib/navigation.js';
	const routes = getNavRoutes('public');
</script>

<Navigation navType="public" {routes} />
<main id="public">
	{@render children()}
</main>
