<script lang="ts">
	import { page } from '$app/state';
	import { getNavRoutes, type RouteInfo } from '$lib/navigation';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();
	const settingsRoutes = getNavRoutes('protected')[1].children as RouteInfo[];
	let currentPagePath = $derived(page.url.pathname);
</script>

<!-- all settings layout-->
<main>
	<section class="settings-layout default-styling">
		<div class="container sidebar-content-layout">
			<div class="settings-sidebar">
				<ul>
					{#each settingsRoutes as route}
						<li class:active={currentPagePath === route.path}>
							<a href={route.path}>{route.name}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="settings-content">
				{@render children()}
			</div>
		</div>
	</section>
</main>
