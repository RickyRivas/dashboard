<script lang="ts">
	import { navigating, page } from '$app/state';
	import type { LayoutProps } from '../$types';
	const { children }: LayoutProps = $props();
	import { findRouteInfo, type RouteInfo } from '$lib/navigation';
	import PageLoader from '$lib/PageLoader.svelte';

	let currentPagePath = $derived(page.url.pathname);
	let routes = $derived(findRouteInfo('/app')?.route.children as RouteInfo[]);

	import ToTop from '$lib/components/ToTop.svelte';

	// TODO: MIGRATE
	import Modal from '$lib/components/ui/Modal.svelte';

	// notes
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import { createSettingsStore } from '$lib/components/content-editor/settingsStore';
	import { onMount, setContext } from 'svelte';
	import { getChecklistFromSB, getNotesFromSB } from '$lib/supabase-db';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';

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

<main>
	<section>
		<div class="container">
			<div id="subnav">
				<h2>Sub Navigation</h2>
				<ul>
					{#each routes as route}
						{#if route.path === '/app'}
							<li class:active={currentPagePath === route.path}>
								<a class="btn" class:active={currentPagePath === route.path} href={route.path}>
									{route.name}
								</a>
							</li>
						{:else}
							<li class:active={currentPagePath.startsWith(route.path)}>
								<a
									class="btn"
									class:active={currentPagePath.startsWith(route.path)}
									href={route.path}>{route.name}</a
								>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</section>
	{@render children()}
</main>

<!-- App Global -->
<div class="global-fixed-btns">
	<ToTop />
	<button
		class="btn"
		class:active={showNotesModal}
		onclick={() => {
			showNotesModal = !showNotesModal;
		}}
	>
		App Notes
	</button>
	<button
		class="btn"
		class:active={showChecklistModal}
		onclick={() => {
			showChecklistModal = !showChecklistModal;
		}}
	>
		Build Checklist
	</button>
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
