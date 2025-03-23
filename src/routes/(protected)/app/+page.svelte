<script>
	import AppNotes from '$lib/app-components/AppNotes.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
</script>

<section class="default-styling">
	<h1>App</h1>
	<CardGroup>
		<Card heading="Notes">
			<AppNotes />
		</Card>
	</CardGroup>
</section>
