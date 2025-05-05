<script lang="ts">
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { FileItem } from '$lib/types';
	import type { PageProps } from '../$types';

	let { data }: PageProps = $props();
	const { imgsData, account } = data;

	let showModal = $state(false);
	let selectedImage = $state() as FileItem;

	let imagesDirectory = $state();
	let currentDirectory = $state();

	if (imgsData) {
		imagesDirectory = imgsData.imagesDirectory;
		currentDirectory = imgsData.imagesDirectory;
	}

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

	let refreshing = $state(false);
	let refreshed = $state(false);
	let refreshError = $state(false);

	async function refresh() {
		if (!account) return;
		let refreshing = true;
		let refreshed = false;

		const response = await fetch('/api/get-local-imgs', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ account })
		});

		const data = await response.json();

		if (data) {
			imagesDirectory = data.imagesDirectory;
			currentDirectory = data.imagesDirectory;
		}

		refreshing = false;
		refreshed = true;
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
			<div class="imgs-builder-btns">
				{#if imagesDirectory.name !== currentDirectory.name}
					<button
						class="btn"
						onclick={() => {
							currentDirectory = findParentObject(currentDirectory);
						}}>Go Back</button
					>
				{/if}
				<button class="btn" onclick={refresh}>
					{#if refreshing}
						<LoadingSpinner
							bind:loading={refreshing}
							bind:error={refreshError}
							bind:success={refreshed}
							dim={44}
						/>
					{:else}
						Refresh
					{/if}
				</button>
			</div>

			<div class="imgs-builder-grid">
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
								class="btn folder-btn"
								disabled={!child.children.length}
								onclick={() => {
									currentDirectory = child;
								}}
							>
								view {child.name} ({child.children.length})
								<svg
									class="folder-icon"
									xmlns="http://www.w3.org/2000/svg"
									width="44"
									height="44"
									fill="none"
									viewBox="0 0 44 44"
								>
									<path
										fill="currentColor"
										d="M5.5 41.25h33c3.034 0 5.5-2.466 5.5-5.5v-22c0-3.034-2.466-5.5-5.5-5.5H24.75a2.731 2.731 0 0 1-2.2-1.1l-1.65-2.2a5.51 5.51 0 0 0-4.4-2.2h-11A5.505 5.505 0 0 0 0 8.25v27.5c0 3.034 2.466 5.5 5.5 5.5Z"
									/>
								</svg>
							</button>
						{/if}
					{/each}
				{/if}
			</div>
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
	.imgs-builder-grid {
		margin-left: 1em;
		list-style: none;
		display: grid;
		gap: 1em;
		grid-template-columns: repeat(2, 1fr);

		@media only screen and (min-width: 768px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media only screen and (min-width: 1024px) {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.folder-btn {
		width: 100%;
		aspect-ratio: ~'1 / 1';
		position: relative;
		z-index: 1;
		color: var(--text);
		background: none;
		text-transform: uppercase;
		line-height: 1.2;
		padding-top: 1.75em;
		svg {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			color: var(--primary);
		}

		&:disabled {
			svg {
				color: #ccc;
			}
		}
	}
	.imgs-builder-btns {
		margin-bottom: 1em;
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
