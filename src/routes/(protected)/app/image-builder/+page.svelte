<script lang="ts">
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { buildTrackerState } from '$lib/tracker-state.svelte';
	import type { FileItem } from '$lib/types';
	import { onMount } from 'svelte';

	let showModal = $state(false);
	let selectedImage = $state() as FileItem;

	let imagesDirectory = $state();
	let currentDirectory = $state();

	onMount(async () => {
		const account = buildTrackerState.buildTracker.account;
		if (!account) {
			console.log('no');
			return;
		}

		const response = await fetch('/api/get-local-imgs', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				account: buildTrackerState.buildTracker.account
			})
		});

		const data = await response.json();

		if (data) {
			imagesDirectory = data.imagesDirectory;
			currentDirectory = data.imagesDirectory;
		}
	});

	function findParentObject(targetObject) {
		// relative paths values are unique
		const targetRelativePath = targetObject.relativePath;

		// Recursive function to search through the tree
		function search(currentObj, parent = null) {
			// If current object matches the target, return the parent
			if (currentObj.relativePath === targetRelativePath) return parent;

			// If the current object has children, search through them
			if (currentObj.children && currentObj.children.length > 0) {
				for (const child of currentObj.children) {
					// Check if this child is the target
					if (child.relativePath === targetRelativePath) {
						return currentObj; // Current object is the parent
					}

					// Search through this child's children
					const result = search(child, currentObj);
					if (result) return result;
				}
			}

			return null;
		}

		return search(imagesDirectory);
	}
</script>

<section>
	<div class="container">
		<h1>Image Builder</h1>
		<p>
			When you select an image, a modal initiates with the common img markup with attributes filled
			out. Only works locally.
		</p>

		{#if imagesDirectory && currentDirectory}
			{#if imagesDirectory.name !== currentDirectory.name}
				<div>
					<button
						class="btn"
						onclick={() => {
							currentDirectory = findParentObject(currentDirectory);
						}}>Go Back</button
					>
				</div>
			{/if}

			{#if currentDirectory.children && currentDirectory.children.length > 0}
				{#each currentDirectory.children as child}
					<!-- list files -->
					{#if child.type === 'file'}
						<button
							class="images-grid-item"
							onclick={() => {
								selectedImage = child;
								showModal = true;
							}}
						>
							<img src={child.dashboardSrc} alt="" width="" />
							<div class="info">
								<p>{child.base}</p>
								<p>{child.fileWidth + 'px'} x {child.fileHeight + 'px'}</p>
								<p>{child.fileSize}</p>
							</div>
						</button>
					{/if}

					<!-- list folders -->
					{#if child.type === 'directory'}
						<button
							class="btn"
							disabled={!child.children.length}
							onclick={() => {
								currentDirectory = child;
							}}
						>
							view {child.name} ({child.children.length})
						</button>
					{/if}
				{/each}
			{/if}
		{/if}
		<!-- 2nd layout-->
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

<style lang="less">
	.images-grid {
		margin-left: 1em;
		list-style: none;
		display: grid;
		gap: 1em;
		@media only screen and (min-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media only screen and (min-width: 1024px) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.images-grid-item {
		width: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border-color);
		position: relative;
		background: none;
		aspect-ratio: ~'1 / 1';
		font: inherit;
		max-width: 330px;

		img {
			width: auto;
			height: auto;
			max-width: 100%;
			max-height: 100%;
			display: block;
		}

		.info {
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 50%);
			text-align: left;
			padding: 1em;
			font-size: 14px;

			p {
				color: #fff;
				margin: 0;
			}
		}
	}
</style>
