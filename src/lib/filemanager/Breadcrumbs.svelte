<script>
	import { getContext } from 'svelte';
	import { delegateClick } from 'wx-lib-dom';
	import { getSelectionOnNavigation } from 'wx-filemanager-store';
	import Icon from './ui/Icon.svelte';

	let { panel } = $props();

	const api = getContext('filemanager-store');
	const _ = getContext('wx-i18n').getGroup('filemanager');

	const { panels } = api.getReactiveState();
	const files = $derived($panels[panel]._files);
	const crumbs = $derived($panels[panel]._crumbs);

	function click(id) {
		const selectedId = getSelectionOnNavigation(id, crumbs);
		api.exec('set-path', {
			id,
			panel,
			...(selectedId && { selected: [selectedId] })
		});
	}

	let loading = $state(null);

	$effect(() => {
		if (files) loading = null;
	});

	function refresh() {
		// console.log('Current folder ID:', crumbs[crumbs.length - 1]?.id);
		loading = true;
		api.exec('request-data', {
			id: crumbs[crumbs.length - 1].id
		});
		//if data was not loaded - stop spinner anyway
		setTimeout(() => {
			loading = null;
		}, 5000);
	}
</script>

<div class="wx-breadcrumbs" use:delegateClick={{ click }} data-menu-ignore="true">
	<div class="wx-refresh-icon">
		<Icon name="refresh" spin={!!loading} onclick={refresh} />
	</div>
	{#each crumbs as crumb, i}
		{#if i}
			<Icon name="angle-right" />
		{/if}
		<div class="wx-item" data-id={crumb.id} data-menu-ignore="true">
			{crumb.id == '/' ? _(crumb.name) : crumb.name}
		</div>
	{/each}
</div>
