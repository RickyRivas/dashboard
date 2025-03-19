<script lang="ts">
	import SettingsNavigation from '$lib/components/SettingsNavigation.svelte';
	import { getNavRoutes, type RouteInfo } from '$lib/navigation';
	let { children } = $props();
	const routes = getNavRoutes('protected')[1].children as RouteInfo[];
</script>

<section class="settings-layout">
	<div class="container">
		<SettingsNavigation {routes} />
	</div>
	<div class="container">
		{@render children()}
	</div>
</section>
