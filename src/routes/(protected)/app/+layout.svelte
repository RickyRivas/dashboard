<script lang="ts">
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();

	import ToTop from '$lib/components/ToTop.svelte';

	// TODO: MIGRATE
	import Modal from '$lib/components/ui/Modal.svelte';

	// notes
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import { createSettingsStore } from '$lib/components/content-editor/settingsStore';
	import { onMount, setContext } from 'svelte';
	import { getChecklistFromSB, getNotesFromSB } from '$lib/supabase-db';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';
	import BuildTracker from '$lib/widgets/BuildTracker.svelte';

	let showNotesModal = $state(false);
	let notesJSON = $state();
	let notesLastSaved = $state('');

	// Lexical Editor (global state)
	const settings = createSettingsStore();
	settings.setOption('emptyEditor', false);
	setContext('settings', settings);

	// checklist
	let showChecklistModal = $state(false);
	let checklistItems = $state([]);

	// client side fetching
	onMount(async () => {
		// get notes
		let { notes, updated } = await getNotesFromSB();
		if (notes) notesJSON = notes;
		if (updated) notesLastSaved = updated;

		// get checklist
		let { checklist } = await getChecklistFromSB();
		if (checklist) checklistItems = checklist;
	});
</script>

{@render children()}

<!-- App Global -->
<div class="global-fixed-btns">
	<div class="scroll-container">
		<ToTop />
		<BuildTracker />
		<button
			class="btn"
			class:active={showNotesModal}
			onclick={() => {
				showNotesModal = !showNotesModal;
			}}
		>
			<span class="cta">App Notes</span>
		</button>
		<button
			class="btn"
			class:active={showChecklistModal}
			onclick={() => {
				showChecklistModal = !showChecklistModal;
			}}
		>
			<span class="cta">Build Checklist</span>
		</button>
	</div>
</div>

{#if showNotesModal}
	<Modal
		maxWidth={1000}
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

{#if showChecklistModal}
	<Modal
		closeModal={() => {
			showChecklistModal = false;
		}}
	>
		{#snippet modalContent()}
			<ChecklistWidget checklist={checklistItems} />
		{/snippet}
	</Modal>
{/if}
