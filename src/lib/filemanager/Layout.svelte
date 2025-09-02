<script>
	import { clickOutside, locateID } from 'wx-lib-dom';
	import { ActionMenu, ContextMenu } from 'wx-svelte-menu';
	import { Uploader } from 'wx-svelte-uploader';
	import { hotkeys } from 'wx-filemanager-store';

	import { getContext, tick } from 'svelte';

	import SearchView from './SearchView.svelte';
	import Info from './Info.svelte';
	import Panels from './Panels.svelte';
	import Sidebar from './Sidebar.svelte';
	import Toolbar from './Toolbar.svelte';
	import TableView from './Table/View.svelte';
	import CardsView from './Cards/View.svelte';

	let { readonly = false, menuOptions, extraInfo } = $props();

	let sidebarWidth = $state();

	let narrowMode = $state();
	let showSidebar = $state(false);

	function resize(node) {
		const ro = new ResizeObserver((entries) => {
			narrowMode = entries[0].borderBoxSize[0].inlineSize < 768;
		});
		ro.observe(node);
	}

	function toggleSidebar() {
		showSidebar = !showSidebar;
	}

	function hideSidebar(ev) {
		if (narrowMode && locateID(ev) !== 'toggle-tree') {
			showSidebar = false;
		}
	}

	const api = getContext('filemanager-store');
	const { showPrompt, showConfirm } = getContext('filemanager-modals');
	const _ = getContext('wx-i18n').getGroup('filemanager');

	const {
		mode: rMode,
		preview: rPreview,
		activePanel: rActivePanel,
		panels: rPanels
	} = api.getReactiveState();

	const selected = $derived($rPanels[$rActivePanel].selected);
	const path = $derived($rPanels[$rActivePanel].path);
	let contextMenuOptions = $state([]);

	const previewOption = {
		icon: 'wxi-eye',
		text: 'Preview',
		id: 'preview'
	};

	function getReadonlyMenu(type) {
		let options = narrowMode ? [previewOption] : [];
		if (type === 'file')
			options = [...options, ...menuOptions().filter((o) => o.id === 'download')];
		return options;
	}

	function resolveContext(id, e) {
		const item = id ? api.getFile(id) : null;
		const inTree = e.target.closest('.tree-item.folder');

		let options;

		if (readonly && item) {
			options = getReadonlyMenu(item?.type);
		} else {
			switch (id) {
				case 'body':
					options = menuOptions(id);
					break;
				default:
					if (item) {
						if (!inTree && selected.length > 1) {
							options = narrowMode
								? [previewOption, ...menuOptions('multiselect')]
								: menuOptions('multiselect');
						} else if (id === '/') {
							options = menuOptions('folder', item).filter((o) => o.id === 'paste');
						} else {
							const mOptions = menuOptions(item.type, item);
							if (mOptions) {
								options = narrowMode ? [previewOption, ...mOptions] : mOptions;
							}
						}
					}
			}
			if ($rMode === 'search') {
				options = options?.filter((o) => o.id !== 'paste');
			}
		}

		if (item?.id && (!selected.length || !selected.some((i) => i === item.id)) && !inTree) {
			api.exec('select-file', { id: item.id });
		}

		if (options?.length) {
			options.forEach((o) => {
				if (inTree) o.hotkey = '';
				if (o.text) o.text = _(o.text);
				if (o.hotkey) o.subtext = o.hotkey;
			});
			contextMenuOptions = options;
			return item || {};
		}
	}

	let copy = null;
	function handleMenu(e) {
		const { action, context } = e;
		if (action) {
			performAction(action.id, context, !action.hotkey);
		}
	}

	function performAction(action, context, inTree) {
		// console.log('performAction', action, context, inTree);
		const ids = inTree ? [context.id] : selected;
		switch (action) {
			case 'download':
				api.exec('download-file', { item: context });
				break;
			case 'copy':
			case 'move':
				copy = {
					action,
					ids: ids
				};
				break;
			case 'paste':
				if (copy) {
					api.exec(copy.action === 'copy' ? 'copy-files' : 'move-files', {
						ids: copy.ids,
						target: context?.type === 'folder' ? context.id : path
					});
					copy = null;
				}
				break;
			case 'rename':
				showPrompt({ item: context });
				break;
			case 'delete':
				showConfirm({ selected: ids });
				break;
			case 'preview':
				api.exec('show-preview', { mode: !$rPreview });
				break;
			// custom action - init markup generator for images
			case 'markup-generator':
				api.exec('markup-generator', { item: context });
				break;
			// custom action - bulk optimize (folder)
			case 'bulk-optimize':
				api.exec('bulk-optimize', { item: context });
				break;
		}
	}

	function getPanel() {
		return $rPanels[$rActivePanel];
	}

	async function handleUpload(f) {
		//if active panel was changed before upload, wait until for it
		await tick();
		const { name, size } = f.file;

		api.exec('create-file', {
			file: {
				name,
				size,
				date: new Date(),
				file: f.file
			},
			parent: path
		});
	}
</script>

<div
	class="wx-filemanager wx-flex"
	use:resize
	use:hotkeys={{
		api,
		menuOptions: readonly ? getReadonlyMenu : menuOptions,
		performAction,
		getPanel
	}}
>
	{#if narrowMode && $rPreview}
		<div class="wx-info-narrow">
			<Info {narrowMode} {extraInfo} />
		</div>
	{:else}
		<Toolbar {narrowMode} onshowtree={toggleSidebar} />
		<ContextMenu
			dataKey={'id'}
			at={'point'}
			options={contextMenuOptions}
			resolver={resolveContext}
			onclick={handleMenu}
		>
			<ActionMenu
				dataKey="actionId"
				options={contextMenuOptions}
				resolver={resolveContext}
				onclick={handleMenu}
			>
				<Uploader apiOnly={true} uploadURL={handleUpload}>
					<div class="wx-content-wrapper wx-flex">
						{#if $rMode !== 'panels' && $rMode !== 'search'}
							<div
								use:clickOutside={hideSidebar}
								class="wx-sidebar"
								class:wx-sidebar-narrow={narrowMode}
								class:wx-sidebar-visible={showSidebar}
								bind:clientWidth={sidebarWidth}
							>
								<Sidebar {readonly} {menuOptions} />
							</div>
							<div class="wx-content">
								<div class="wx-content-item{$rPreview ? '' : '-fit'}" data-id="body">
									{#if $rMode === 'table'}
										<TableView panel={$rActivePanel} />
									{:else}
										<CardsView />
									{/if}
								</div>
								{#if $rPreview}
									<div class="wx-info">
										<Info {extraInfo} />
									</div>
								{/if}
							</div>
						{:else}
							<div class="wx-content-item{$rPreview ? '' : '-fit'}">
								{#if $rMode === 'panels'}
									<Panels />
								{:else}
									<SearchView />
								{/if}
							</div>
							{#if $rPreview}
								<div class="wx-info">
									<Info {extraInfo} />
								</div>
							{/if}
						{/if}
					</div>
				</Uploader>
			</ActionMenu>
		</ContextMenu>
	{/if}
</div>
