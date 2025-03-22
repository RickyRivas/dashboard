<script>
	import AppNotes from '$lib/app-components/AppNotes.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	let showAppModal = $state(false);
</script>

<h1>App</h1>

<CardGroup>
	<Card heading="Notes">
		<AppNotes />
	</Card>
</CardGroup>

<button
	onclick={() => {
		showAppModal = !showAppModal;
	}}>show modal</button
>

{#if showAppModal}
	<Modal
		closeModal={() => {
			showAppModal = false;
		}}
	>
		{#snippet modalContent()}
			<h1>Ricky</h1>
			<button>hi</button>
		{/snippet}
	</Modal>
{/if}
