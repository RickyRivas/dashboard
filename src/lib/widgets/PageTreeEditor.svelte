<script lang="ts">
	// svelte
	import { page } from '$app/state';
	import { onDestroy, onMount } from 'svelte';

	// logic
	let { site, pages = $bindable(), onPagesTreeChange } = $props();
	let treeContainer;
	let sortableTree;
	let SortableTree;
	// rebuilt array for tree
	let currentTreeNodes = $state([]);
	// compare
	let pagesOnMount = $state(pages);
	let hasChanges = $state(false);

	let mounted = $state(false);

	// Convert flat pages array to SortableTreeNodeData format
	function buildTreeNodes(pagesArray) {
		const sorted = pagesArray.sort((a, b) => a.display_order - b.display_order);
		const pageMap = new Map();

		// Create nodes for all pages
		sorted.forEach((page) => {
			pageMap.set(page.id, {
				data: {
					id: page.id,
					title: page.title,
					slug: page.slug,
					display_order: page.display_order,
					is_homepage: page.is_homepage,
					parent_id: page.parent_id,
					navigation_item_type: page.navigation_item_type
				},
				nodes: []
			});
		});

		const rootNodes = [];

		// Build hierarchy
		sorted.forEach((page) => {
			const node = pageMap.get(page.id);

			if (page.parent_id) {
				const parent = pageMap.get(page.parent_id);
				if (parent) {
					parent.nodes.push(node);
				}
			} else {
				rootNodes.push(node);
			}
		});

		return rootNodes;
	}

	// Convert parsed node component data back to flat array
	function flattenParsedNodes(nodes, parentId = null) {
		let result = [];

		nodes.forEach((node, index) => {
			const pageData = {
				id: node.element._data.id,
				parent_id: parentId,
				display_order: index,
				title: node.element._data.title,
				slug: node.element._data.slug,
				is_homepage: node.element._data.is_homepage,
				navigation_item_type: node.element._data.navigation_item_type
			};

			result.push(pageData);

			if (node.subnodes && node.subnodes.length > 0) {
				result = result.concat(flattenParsedNodes(node.subnodes, node.element._data.id));
			}
		});

		return result;
	}

	function getPageUpdates() {
		if (!hasChanges || !currentTreeNodes.length) return [];

		const flattenedPages = flattenParsedNodes(currentTreeNodes);
		const updates = [];

		flattenedPages.forEach((newPage) => {
			const originalPage = pages.find((p) => p.id === newPage.id);

			if (
				originalPage &&
				(originalPage.parent_id !== newPage.parent_id ||
					originalPage.display_order !== newPage.display_order)
			) {
				updates.push({
					id: newPage.id,
					parent_id: newPage.parent_id,
					display_order: newPage.display_order
				});
			}
		});

		return updates;
	}

	function initializeTree() {
		if (!SortableTree || !treeContainer) return;

		const treeNodes = buildTreeNodes(pages);
		hasChanges = false;

		sortableTree = new SortableTree({
			nodes: treeNodes,
			element: treeContainer,
			lockRootLevel: false,
			handleSelector: '.drag-handle',
			// Validate moves before UI updates
			confirm: async (movedNode, targetParentNode) => {
				const movedType = movedNode._data.navigation_item_type;
				const targetType = targetParentNode?._data?.navigation_item_type;

				// Pages can only be placed in folders or at root level
				if (movedType === 'page') {
					if (targetParentNode && targetType !== 'folder') {
						console.warn('Pages can only be placed in folders or at root level');
						return false;
					}
				}

				// Folders can be placed in other folders or at root, but NOT in pages
				if (movedType === 'folder') {
					if (targetParentNode && targetType === 'page') {
						console.warn('Folders cannot be placed inside pages');
						return false;
					}
				}

				// Links can be placed anywhere except inside pages
				if (movedType === 'link') {
					if (
						(targetParentNode && targetType === 'page') ||
						(targetParentNode && targetType === 'link')
					) {
						console.warn('Links can only be placed inside folders');
						return false;
					}
				}

				return true;
			},

			// This only runs if confirm returns true
			onChange: async ({ nodes, movedNode, srcParentNode, targetParentNode }) => {
				currentTreeNodes = nodes;
				hasChanges = true;

				const moveInfo = {
					movedPageId: movedNode._data.id,
					movedPageTitle: movedNode._data.title,
					movedType: movedNode._data.navigation_item_type,
					fromParent: srcParentNode?._data?.title || 'Root',
					toParent: targetParentNode?._data?.title || 'Root',
					fromParentId: srcParentNode?._data?.id || null,
					toParentId: targetParentNode?._data?.id || null
				};

				onPagesTreeChange({
					hasChanges,
					updatesCount: getPageUpdates().length,
					moveInfo
				});
			},

			onClick: async (event, node) => {
				// const pageId = node._data.id;
				// console.log(event, node._data);
				// if (pageId) {
				// 	window.location.href = `/app/sites/${site.id}/pages/${pageId}`;
				// }
			},
			renderLabel: (data) => {
				return `
    <span data-nav-type="${data.navigation_item_type}" class="nav-item-content">
      <span class="drag-handle">⋮⋮</span>
      <a href="/app/sites/${site.id}/pages/${data.id}" onclick="event.stopPropagation()">
        ${data.title}
      </a>
    </span>
  `;
			}
		});
	}

	onMount(async () => {
		try {
			const module = await import('sortable-tree');
			SortableTree = module.default;
			initializeTree();
			mounted = true;
		} catch (error) {
			console.error('Failed to load sortable-tree:', error);
		}
	});

	async function saveChanges() {
		try {
			for (const update of getPageUpdates()) {
				const { data, error } = await page.data.supabase
					.from('site_navigation')
					.update({
						display_order: update.display_order,
						parent_id: update.parent_id
					})
					.eq('id', update.id)
					.eq('site_id', site.id); // Extra security check

				if (error) {
					console.error('Failed to update page:', update.id, error);
					break;
				}
			}

			hasChanges = false;
		} catch (error) {
			console.error('Failed to update pages:', error);
			throw error;
		}
	}

	function destroyTree() {
		// Clear the container first to remove DOM elements
		if (treeContainer) {
			treeContainer.innerHTML = '';
		}

		// Then try to destroy the instance
		try {
			if (sortableTree && typeof sortableTree.destroy === 'function') {
				sortableTree.destroy();
			}
		} catch (error) {
			// Ignore cleanup errors on page navigation
		}

		sortableTree = null;
	}

	onDestroy(() => {
		destroyTree();
	});

	$effect(() => {
		// if we update pages array from parent (usually when we add a new page)
		if (mounted && pages !== pagesOnMount) {
			destroyTree();
			initializeTree();
		}
	});
</script>

{#if pages.length}
	<div id="pages-tree" bind:this={treeContainer}></div>
	{#if hasChanges}
		<button class="btn" onclick={saveChanges}>save changes</button>
	{/if}
{:else}
	<p>This site has no pages.</p>
{/if}
