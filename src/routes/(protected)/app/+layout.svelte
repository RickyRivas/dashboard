<script lang="ts">
	import { page } from '$app/state';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { getNavRoutes, type RouteInfo } from '$lib/navigation';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();
	const parentRoute = getNavRoutes('protected')[0];
	const appRoutes = getNavRoutes('protected')[0].children as RouteInfo[];
	let currentPagePath = $derived(page.url.pathname);
</script>

<main class="sidebar-content-layout">
	<Sidebar {parentRoute} routes={appRoutes} {currentPagePath} />
	<div id="content">
		{@render children()}
	</div>
</main>
