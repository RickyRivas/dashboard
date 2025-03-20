<script>
	import SettingsCard from '$lib/components/settings/SettingsCard.svelte';
</script>

<h1>Billing Settings</h1>
<SettingsCard heading="Invoices">
	{#snippet children()}{/snippet}
</SettingsCard>
