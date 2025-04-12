<script lang="ts">
	import { page } from '$app/state';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/settings')?.route.children as RouteInfo[]);
</script>

<main>
	<aside id="sidebar">
		<div class="container">
			<h2>Navigation</h2>
			<ul>
				{#each routes as route}
					<li class:active={currentPagePath.startsWith(route.path)}>
						<a class="btn" href={route.path}>{route.name}</a>
					</li>
				{/each}
			</ul>
		</div>
	</aside>
	{@render children()}
</main>
