<script lang="ts">
	import { page } from '$app/state';
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/settings')?.route.children as RouteInfo[]);
</script>

<main>
	<section>
		<div class="container">
			<div id="subnav">
				<h2>Sub Navigation</h2>
				<ul>
					{#each routes as route}
						{#if route.path === '/settings'}
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
									href={route.path}
								>
									{route.name}
								</a>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</section>
	{@render children()}
</main>
