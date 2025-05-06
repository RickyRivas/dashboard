<script lang="ts">
	import { navigating, page } from '$app/state';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import PageLoader from '$lib/PageLoader.svelte';

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/app')?.route.children as RouteInfo[]);
</script>

<main>
	<section>
		<div class="container">
			<div id="subnav">
				<h2>Sub Navigation</h2>
				<ul>
					{#each routes as route}
						{#if route.path === '/app'}
							<li class:active={currentPagePath === route.path}>
								<a class="btn" class:active={currentPagePath === route.path} href={route.path}>
									{route.name}
								</a>
							</li>
						{:else}
							<li class:active={currentPagePath.startsWith(route.path)}>
								<a
									class="btn"
									class:active={currentPagePath.startsWith(route.path)}
									href={route.path}>{route.name}</a
								>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</section>
	{@render children()}
</main>
