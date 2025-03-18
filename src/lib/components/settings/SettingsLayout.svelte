<script>
	import SettingsNavigation from '$lib/components/SettingsNavigation.svelte';
	let { children } = $props();
</script>

<section class="settings-layout">
	<div class="container">
		<SettingsNavigation />
	</div>
	<div class="container">
		{@render children()}
	</div>
</section>
