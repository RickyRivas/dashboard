<script>
	import SettingsCard from '$lib/components/settings/SettingsCard.svelte';
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
</script>

<SettingsLayout>
	{#snippet children()}
		<SettingsCard heading="Billing Settings">
			{#snippet children()}{/snippet}
		</SettingsCard>
	{/snippet}
</SettingsLayout>
