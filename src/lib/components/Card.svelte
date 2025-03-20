<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, heading }: { children: Snippet; heading: string } = $props();
</script>

<div class="card">
	<h2 class="card-heading">{heading}</h2>
	<div class="card-content">
		{@render children()}
	</div>
</div>
