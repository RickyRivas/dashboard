<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getNotesFromSB, saveNotesToSB } from '$lib/supabase-db';
	import moment from 'moment';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let quill;
	let editorContainer: HTMLDivElement;
	let html = $state('');
	let text = $state('');
	let lastUpdated = $state('');

	onMount(async () => {
		const Quill = (await import('quill')).default;

		if (editorContainer) {
			quill = new Quill(editorContainer, {
				modules: {
					toolbar: [
						[{ header: [1, 2, 3, false] }],
						['bold', 'italic', 'underline'],
						[{ list: 'ordered' }, { list: 'bullet' }],
						['link', 'image', 'video'],
						['code-block', 'clean']
					]
				},
				theme: 'snow'
			});

			// if (notes) quill.setContents([{ insert: notes }]);
			const { notes, updated } = await getNotesFromSB();
			if (notes && quill) {
				quill.root.innerHTML = notes;
			}

			if (updated) lastUpdated = updated;

			if (quill) {
				quill.on('text-change', (range, oldRange, source) => {
					if (source == 'api' || 'user') {
						html = quill.root.innerHTML;
						text = quill.getContents().ops[0].insert;
					}
				});
			}
		}
	});

	onDestroy(() => {
		if (quill) quill.off();
	});

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);

	async function saveNotes() {
		if (html && editorContainer) {
			success = false;
			error = false;
			loading = true;

			// save markup to DB
			const { error: saveNotesError } = await saveNotesToSB(html);

			if (!saveNotesError) success = true;
			else error = true;

			setTimeout(() => {
				loading = false;
			}, 1000);
		}
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/quill@2.0.3/dist/quill.snow.css"
		crossorigin="anonymous"
	/>
</svelte:head>

<h2>App Notes</h2>
{#if lastUpdated}
	<span style="font-size: 14px">
		Last Saved: {moment(lastUpdated).format('MMMM D, YYYY [at] h:mm A')}.
	</span>
{/if}

<div class="notes-widget" bind:this={editorContainer}></div>

<button class="btn" onclick={saveNotes} disabled={loading} class:error class:success>
	{#if loading}
		<LoadingSpinner dim={44} {loading} {success} {error} />
	{:else}
		<span>Save Notes</span>
	{/if}
</button>
