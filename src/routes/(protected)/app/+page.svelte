<script lang="ts">
	import { page } from '$app/state';
	import AppNotes from '$lib/app-components/AppNotes.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { RouteInfo } from '$lib/navigation';
	import { getBreadcrumbs } from '$lib/navigation';

	const parentRoute = getBreadcrumbs(page.url.pathname)[0];
	const appRoutes = parentRoute?.children as RouteInfo[];
	let currentPagePath = $derived(page.url.pathname);
</script>

<main class="sidebar-content-layout">
	<Sidebar {parentRoute} routes={appRoutes} {currentPagePath} />
	<div class="container">
		<section class="default-styling">
			<h1>App</h1>
			<CardGroup>
				<Card heading="Notes">
					<AppNotes />
				</Card>
			</CardGroup>
		</section>
	</div>
</main>
