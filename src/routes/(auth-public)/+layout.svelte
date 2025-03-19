<script lang="ts">
	// global layout and styles
	import { type Snippet } from 'svelte';
	type prop = {
		children: Snippet;
	};

	const { children }: prop = $props();
</script>

<h1>auth only layout</h1>
<main id="auth">
	{@render children()}
</main>
<a href="/">back</a>
