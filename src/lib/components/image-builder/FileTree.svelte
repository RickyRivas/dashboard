<script>
	import Tree from '$lib/components/image-builder/FileTree.svelte';
	let {
		level = 0,
		arrayTree,
		onOpenModal,
		selectedImage = $bindable(),
		showModal = $bindable()
	} = $props();
</script>

<ul class="level-{level}" class:grid={level > 0} class:parent={level === 0}>
	{#each arrayTree as branch}
		<li class="list-item-level-{level}" class:break={level > 1}>
			{#if branch.type === 'directory'}
				<h2>Folder: {branch.name}</h2>
				{#if branch.children.length > 0}
					<Tree
						arrayTree={branch.children}
						level={level + 1}
						onOpenModal={(e) => {
							selectedImage = e;
							showModal = true;
						}}
					/>
				{:else}
					<p>No files.</p>
				{/if}
			{:else}
				<button
					class="grid-item grid-item-level-{level}"
					onclick={() => {
						onOpenModal(branch);
					}}
				>
					<img src={branch.dashboardSrc} alt="" width="" />
					<div class="info">
						<p>{branch.base}</p>
						<p>{branch.fileWidth + 'px'} x {branch.fileHeight + 'px'}</p>
						<p>{branch.fileSize}</p>
					</div>
				</button>
			{/if}
		</li>
	{/each}
</ul>

<style lang="less">
	ul.parent {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	ul.grid {
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

	.grid-item {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--border-color);
		position: relative;
		background: none;
		aspect-ratio: ~'1 / 1';
		font: inherit;
		max-width: 330px;
		margin: 0 auto;
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
