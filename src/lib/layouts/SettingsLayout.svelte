<script>
	import SettingsNavigation from '$lib/components/SettingsNavigation.svelte';
	let { content } = $props();
</script>

<section class="settings-layout">
	<div class="container">
		<SettingsNavigation />
	</div>
	<div class="container">
		{@render content()}
	</div>
</section>
