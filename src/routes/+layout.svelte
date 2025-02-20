<script lang="ts">
	// global layout and styles
	import { type Snippet } from 'svelte';
	import './styles.less';
	type prop = {
		children: Snippet;
	};

	const { children }: prop = $props();
</script>

{@render children()}
