<script>
	import { settingsRoutes } from '$lib/navigation';
</script>

<ul>
	{#each settingsRoutes as route}
		<li>
			<a href={route.path}>{route.name}</a>
		</li>
	{/each}
</ul>
