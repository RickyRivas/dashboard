<script>
	let { routes, parentRoute, currentPagePath = $bindable() } = $props();
</script>

<aside class="sidebar">
	<ul>
		<!-- {#if parentRoute}
			<li class:active={currentPagePath === parentRoute.path}>
				<a href={parentRoute.path}>{parentRoute.name}</a>
			</li>
		{/if} -->
		<h2>Sub Navigation</h2>
		{#each routes as route}
			<li class:active={currentPagePath === route.path}>
				<a href={route.path}>{route.name}</a>
			</li>
		{/each}
	</ul>
</aside>
