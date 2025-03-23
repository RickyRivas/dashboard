<script>
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
</script>

<section class="default-styling">
	<h1>Billing Settings</h1>
	<CardGroup>
		<Card heading="Invoices">
			{#snippet children()}{/snippet}
		</Card>
	</CardGroup>
</section>
