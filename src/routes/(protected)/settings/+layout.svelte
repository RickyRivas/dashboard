<script lang="ts">
	import { page } from '$app/state';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/settings')?.route.children as RouteInfo[]);
</script>

{@render children()}
