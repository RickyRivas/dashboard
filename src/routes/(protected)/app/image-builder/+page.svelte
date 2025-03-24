<script lang="ts">
	import FileTree from '$lib/components/image-builder/FileTree.svelte';
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { FileItem } from '$lib/types';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();

	let showModal = $state(false);
	let selectedImage = $state() as FileItem;
</script>

<main>
	<section class="default-styling">
		<div class="container">
			<h1>Image Builder</h1>
			<p>
				When you select an image, a modal initiates with the common img markup with attributes
				filled out.
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
</main>

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
