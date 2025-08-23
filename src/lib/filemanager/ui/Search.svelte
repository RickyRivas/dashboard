<script>
	import { getContext } from 'svelte';

	let { value = '', onsearch } = $props();

	const _ = getContext('wx-i18n').getGroup('filemanager');

	let node = null;
	let icon = $derived(value !== '' ? 'wxi-close' : 'wxi-search');

	function oninput(e) {
		value = e.target.value;
		onsearch && onsearch({ value });
	}

	function clear() {
		value = '';
		node.focus();
		onsearch && onsearch({ value });
	}
</script>

<div class="wx-search-input">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<i class="wx-icon {icon}" onclick={clear}></i>
	<input type="text" class="wx-text" bind:this={node} {value} {oninput} placeholder={_('Search')} />
</div>
