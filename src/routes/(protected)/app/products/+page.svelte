<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const products = data.products;
</script>

<section>
	<div class="container">
		<h1>Products</h1>
		<p>Products offered at Rivas Web Designs.</p>
		{#if products.length}
			<ul>
				{#each products as product}
					<li>
						<h3>{product.name}</h3>
						<span>{product.default_price}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No products.</p>
		{/if}
	</div>
</section>
