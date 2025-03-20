<script>
	import SettingsCard from '$lib/components/settings/SettingsCard.svelte';
</script>

<SettingsCard heading="Billing Settings">
	{#snippet children()}
		<h2>Stripe Info</h2>
	{/snippet}
</SettingsCard>
