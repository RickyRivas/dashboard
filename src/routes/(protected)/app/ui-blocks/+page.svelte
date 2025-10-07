<script>
	let componentsCategories = ['slideshows', 'headings'];
	let sectionsCategories = ['hero', 'footer'];

	// url structure /root/type/category - show everything in category
	let rootPath = '/app/ui-blocks';
</script>

<section>
	<div class="container">
		<h1>UI Blocks</h1>
		<p>select a category of blocks. Components and sections.</p>
		<h2>Component Categories</h2>
		<ul>
			{#each componentsCategories as cat}
				<li>
					<a href="{rootPath}/component/{cat}">{cat}</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
