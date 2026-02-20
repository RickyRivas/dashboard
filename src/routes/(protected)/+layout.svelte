<script lang="ts">
	import type { LayoutProps } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';
	import { page } from '$app/state';
	const { children }: LayoutProps = $props();
	const routes = getNavRoutes('protected');

	let currentPage = $derived(page.url.pathname.split('/')[page.url.pathname.split('/').length - 1]);
</script>

<svelte:head>
	<!-- cloudinary -->
	<script
		src="https://upload-widget.cloudinary.com/latest/global/all.js"
		type="text/javascript"
	></script>
</svelte:head>

<div class="protected-body-wrapper">
	<Navigation navType="protected" {routes} />

	<main class="protected-layout page-{currentPage}">
		{@render children()}
	</main>
</div>
