<script lang="ts">
	import { onDestroy } from 'svelte';
	import { saveNotesToSB } from '$lib/supabase-db';
	import moment from 'moment';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ContentEditor from '$lib/components/content-editor/ContentEditor.svelte';
	let { data, notesLastSaved, onUpdateValue } = $props();

	let editorContainer: HTMLDivElement;

	let lastUpdated = $state(notesLastSaved || '');
	let notes = $state(data || '');

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);

	async function saveNotes(data) {
		success = false;
		error = false;
		loading = true;

		// save markup to DB
		const response = await saveNotesToSB(data);
		if (response.error) {
			error = true;
			loading = false;

			setTimeout(() => {
				loading = false;
			}, 1000);

			return;
		}

		let updatedColumn = Array.isArray(response.data) ? response.data[0] : data;

		let savedNotes = updatedColumn.content;
		let newUpdatedTimestamp = updatedColumn.updated_at;

		// update local state
		lastUpdated = newUpdatedTimestamp;
		notes = savedNotes;

		success = true;

		setTimeout(() => {
			loading = false;
		}, 1000);
	}

	onDestroy(() => {});
</script>

<h2>App Notes</h2>

<div class="notes-widget-header">
	{#if lastUpdated}
		<span>
			Last Saved: {moment(lastUpdated).format('MMMM D, YYYY [at] h:mm A')}.
		</span>
	{/if}

	{#if loading}
		<span>
			<LoadingSpinner dim={44} {loading} {success} {error} />
		</span>
	{/if}
</div>

<div class="notes-widget" bind:this={editorContainer}></div>

<ContentEditor
	json={data}
	onUpdateValue={async (e) => {
		// console.log('updated value. saving notes...', e);
		// save to DB
		await saveNotes(e);
		// update parent state
		onUpdateValue({ notes, lastUpdated });
	}}
/>

<!-- <button class="btn" onclick={saveNotes} disabled={loading} class:error class:success>
	{#if loading}
		<LoadingSpinner dim={44} {loading} {success} {error} />
	{:else}
		<span>Save Notes</span>
	{/if}
</button> -->

<style>
	.notes-widget-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		line-height: 44px;
	}
</style>
