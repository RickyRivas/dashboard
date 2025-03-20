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

<!-- all settings layout-->
<main>
	<section class="settings-layout default-styling">
		<div class="container sidebar-content-layout">
			<Sidebar {parentRoute} routes={appRoutes} {currentPagePath} />
			<div class="settings-content">
				{@render children()}
			</div>
		</div>
	</section>
</main>
