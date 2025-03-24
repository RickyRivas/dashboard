<script>
	let { routes, parentRoute, currentPagePath = $bindable(), catsAndCounts = null } = $props();
</script>

<aside id="sidebar">
	<!-- Top Level -->
	<!-- <div>
		<h2>Navigation</h2>
		<ul>
			{#if parentRoute}
				<li class:active={currentPagePath.startsWith(parentRoute.path)}>
					<a href={parentRoute.path}>{parentRoute.name}</a>
				</li>
			{/if}
		</ul>
	</div> -->

	<!-- Sub Navigation -->
	<div>
		<!-- <h2>Sub Navigation</h2> -->
		<ul>
			{#each routes as route}
				<li class:active={currentPagePath.startsWith(route.path)}>
					<a href={route.path}>{route.name}</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- categories and their counts (optional) -->
	{#if catsAndCounts}
		<div>
			<h2>Categories</h2>
			<ul>
				{#each catsAndCounts as catAndCount}
					<li class:active={currentPagePath.includes(catAndCount.category)}>
						<a
							href={`${parentRoute.children.find((i) => currentPagePath.startsWith(i.path)).path}/${catAndCount.category}`}
						>
							{catAndCount.category} ({catAndCount.count})
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</aside>
