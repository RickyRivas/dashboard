<script>
	import { getContext } from 'svelte';
	import { Segmented, TwoState } from 'wx-svelte-core';
	import Search from './ui/Search.svelte';
	import Icon from './ui/Icon.svelte';

	let { narrowMode = false, onshowtree } = $props();

	const api = getContext('filemanager-store');

	const { mode, preview: info, search: searchValue } = api.getReactiveState();

	const _ = getContext('wx-i18n').getGroup('filemanager');

	const options = [
		{ icon: 'wxi-view-sequential', id: 'table' },
		{ icon: 'wxi-view-grid', id: 'cards' },
		{ icon: 'wxi-view-column', id: 'panels' }
	];

	function changeMode({ value }) {
		api.exec('set-mode', { mode: value });
	}
	function toggleInfo(e) {
		e.preventDefault();
		api.exec('show-preview', { mode: !$info });
	}
	function search(e) {
		api.exec('filter-files', { text: e.value });
	}
</script>

<div class="wx-toolbar">
	<div class="wx-left {narrowMode ? 'wx-left-narrow' : ''}">
		{#if !narrowMode}
			<span class="wx-name">{_('Files')}</span>
		{:else if !($mode == 'panels' || $mode == 'search')}
			<div class="wx-sidebar-icon" data-id="toggle-tree">
				<Icon onclick={() => onshowtree && onshowtree()} name="subtask" />
			</div>
		{/if}
		<Search onsearch={search} value={$searchValue} />
	</div>

	<div class="wx-right">
		{#if !narrowMode}
			<div class="wx-preview-icon">
				<TwoState onclick={toggleInfo} value={$info}>
					<i class="wxi-eye"></i>
				</TwoState>
			</div>
		{/if}
		<div class="wx-modes">
			<Segmented value={$mode} {options} onchange={changeMode} />
		</div>
	</div>
</div>
