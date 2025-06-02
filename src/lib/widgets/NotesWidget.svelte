<script>
	import { onMount } from 'svelte';
	import { getNotesFromSB, saveNotesToSB } from '$lib/supabase-db';
	import moment from 'moment';

	let quill;
	let editorContainer;

	let lastUpdated = '';
	let typing = false;

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		[{ header: 1 }, { header: 2 }],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ script: 'sub' }, { script: 'super' }],
		['clean']
	];

	onMount(async () => {
		await import('quill/dist/quill.snow.css');
		const Quill = (await import('quill')).default;

		quill = new Quill(editorContainer, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow'
		});

		// get content & display
		const { notes, updated } = await getNotesFromSB();
		lastUpdated = updated;
		quill.root.innerHTML = notes;

		// listen for changes
		// saves if we click outside container after typing
		quill.on('selection-change', async (range, oldRange, source) => {
			if (range) {
				typing = true;
			} else if (typing) {
				const html = quill.root.innerHTML;
				await saveNotesToSB(html);
				typing = false;
			}
		});
	});
</script>

<h2>App Notes</h2>
{#if lastUpdated}
	<p>
		Last Saved: {moment(lastUpdated).format('MMMM D, YYYY [at] h:mm A')}.
		{#if typing}
			<span class="green-text"> Waiting for you to click outside...</span>
		{/if}
	</p>
{/if}
<div class="editor-wrapper" class:typing>
	<div bind:this={editorContainer}></div>
</div>

<style lang="less">
	.editor-wrapper {
		height: 400px;
		margin-bottom: 80px; /* Space for toolbar */
		position: relative;
		display: block;
	}

	p {
		margin: 0;
		font-size: 16px;
	}

	.green-text {
		color: green;
	}
</style>
