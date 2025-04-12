<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/app')?.route.children as RouteInfo[]);
</script>

<main>
	<aside id="sidebar">
		<div class="container">
			<h2>Sub Navigation</h2>
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
