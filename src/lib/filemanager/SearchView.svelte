<script>
	import { getContext } from 'svelte';
	import Panel from './Cards/Panel.svelte';
	import Icon from './ui/Icon.svelte';

	const _ = getContext('wx-i18n').getGroup('filemanager');
	const api = getContext('filemanager-store');

	let { panels, activePanel } = api.getReactiveState();
	let crumbs = $derived($panels[$activePanel]._crumbs);

	function clearSearch() {
		api.exec('filter-files', {
			text: ''
		});
	}
</script>

<div class="wx-search">
	<div class="wx-toolbar">
		<div class="wx-back-icon">
			<Icon name="angle-left" onclick={clearSearch} />
		</div>
		<div class="wx-text">
			{_('Search results in')}
			{#each crumbs as crumb, i}
				{#if i}/{/if}
				{crumb.id == '/' ? _(crumb.name) : crumb.name}
			{/each}
		</div>
	</div>
	<Panel />
</div>
