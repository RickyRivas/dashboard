<script lang="ts">
	import type { LayoutProps } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';
	import { page } from '$app/state';
	const { children }: LayoutProps = $props();
	const routes = getNavRoutes('protected');

	let currentPagePath = $derived(page.url.pathname);
</script>

<div class="protected-body-wrapper">
	<Navigation navType="protected" {routes} />

	<main class="protected-layout">
		{@render children()}
	</main>
</div>
