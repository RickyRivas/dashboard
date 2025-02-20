<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	const { children, data } = $props();
</script>

<Navigation navType="public" />
<main id="public">
	{@render children()}
</main>
