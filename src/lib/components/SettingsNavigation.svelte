<script lang="ts">
	import type { RouteInfo } from '$lib/navigation';
	let { routes }: { routes: RouteInfo[] } = $props();
</script>

<div class="settings-sidebar">
	<ul>
		{#each routes as route}
			<li>
				<a href={route.path}>{route.name}</a>
			</li>
		{/each}
	</ul>
</div>
