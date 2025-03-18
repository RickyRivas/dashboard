<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, heading }: { children: Snippet; heading: string } = $props();
</script>

<div class="settings-card">
	<h2 class="setting-card-heading">{heading}</h2>
	<div class="settings-card-content">
		{@render children()}
	</div>
</div>
