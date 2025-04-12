<script lang="ts">
	import AppNotes from '$lib/app-components/AppNotes.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
</script>

<section>
	<div class="container">
		<h1>App</h1>
		<CardGroup>
			<Card heading="Notes">
				<AppNotes />
			</Card>
		</CardGroup>
	</div>
</section>
