<script lang="ts">
	import type { LayoutProps } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';
	const { children }: LayoutProps = $props();
	const routes = getNavRoutes('protected');
</script>

<Navigation navType="protected" {routes} />

{@render children()}
