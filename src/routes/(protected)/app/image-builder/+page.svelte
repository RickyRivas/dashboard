<script lang="ts">
	import FileTree from '$lib/components/image-builder/FileTree.svelte';
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { buildTrackerState } from '$lib/tracker-state.svelte';
	import type { FileItem } from '$lib/types';
	import { onMount } from 'svelte';

	let showModal = $state(false);
	let selectedImage = $state() as FileItem;
	let data = $state([]);

	onMount(async () => {
		const account = buildTrackerState.buildTracker.account;
		if (!account) return;

		const response = await fetch('/api/get-local-imgs', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				account: buildTrackerState.buildTracker.account
			})
		});

		const imgsData = await response.json();

		data = imgsData;
	});
</script>

<section>
	<div class="container">
		<h1>Image Builder</h1>
		<p>
			When you select an image, a modal initiates with the common img markup with attributes filled
			out. Only works locally.
		</p>

		<FileTree
			arrayTree={data.fileTree}
			bind:selectedImage
			bind:showModal
			onOpenModal={(e: FileItem) => {
				selectedImage = e;
				showModal = true;
			}}
		/>
	</div>
</section>

{#if showModal}
	<Modal
		closeModal={() => {
			selectedImage = '';
			showModal = false;
		}}
	>
		{#snippet modalContent()}
			<ModalImageBuilder img={selectedImage} />
		{/snippet}
	</Modal>
{/if}
