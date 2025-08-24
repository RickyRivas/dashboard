<script lang="ts">
	import type { LayoutProps } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';
	import ToTop from '$lib/components/ToTop.svelte';
	const { children }: LayoutProps = $props();
	const routes = getNavRoutes('protected');

	// TODO: MIGRATE
	import Modal from '$lib/components/ui/Modal.svelte';
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import { createSettingsStore } from '$lib/components/content-editor/settingsStore';
	import { onMount, setContext } from 'svelte';
	import { getNotesFromSB } from '$lib/supabase-db';
	let showNotesModal = $state(false);

	// Lexical Editor (global state)
	const settings = createSettingsStore();
	settings.setOption('emptyEditor', false);
	setContext('settings', settings);

	// client side fetching
	let notesJSON = $state();
	let notesLastSaved = $state('');

	onMount(async () => {
		let { notes, updated } = await getNotesFromSB();
		if (notes) notesJSON = notes;
		if (updated) notesLastSaved = updated;
	});
</script>

<Navigation navType="protected" {routes} />

{@render children()}

<!-- App Global -->
<div class="global-fixed-btns">
	<ToTop />
	<button
		class="btn"
		onclick={() => {
			showNotesModal = !showNotesModal;
		}}>Notes</button
	>
</div>

{#if showNotesModal}
	<Modal
		closeModal={() => {
			showNotesModal = false;
		}}
	>
		{#snippet modalContent()}
			<NotesWidget
				data={notesJSON}
				{notesLastSaved}
				onUpdateValue={(newData) => {
					if (newData.notes) notesJSON = newData.notes;
					if (newData.lastUpdated) notesLastSaved = newData.lastUpdated;
				}}
			/>
		{/snippet}
	</Modal>
{/if}
