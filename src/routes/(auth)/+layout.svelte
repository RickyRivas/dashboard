<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	type prop = {
		children: Snippet;
		data: LayoutData;
	};

	const { children }: prop = $props();
</script>

<main id="auth">
	{@render children()}
</main>
