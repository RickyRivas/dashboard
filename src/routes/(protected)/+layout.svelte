<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';
	type prop = {
		children: Snippet;
		data: LayoutData;
	};
	const { children, data }: prop = $props();
	const routes = getNavRoutes('protected');
</script>

<Navigation navType="protected" {routes} />
<main id="protected">
	{@render children()}
</main>
