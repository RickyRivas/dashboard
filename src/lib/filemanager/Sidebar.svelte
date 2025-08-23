<script>
	import { getContext } from 'svelte';

	import { Button } from 'wx-svelte-core';
	import { DropDownMenu, registerMenuItem } from 'wx-svelte-menu';

	import Tree from './Tree/Tree.svelte';

	import Drive from './Drive.svelte';
	import UploadButton from './UploadButton.svelte';

	let { readonly, menuOptions } = $props();

	const _ = getContext('wx-i18n').getGroup('filemanager');
	const { showPrompt } = getContext('filemanager-modals');

	registerMenuItem('upload', UploadButton);

	function handleClick({ action }) {
		if (action) {
			if (action.id === 'add-file')
				showPrompt({
					item: {
						type: 'file',
						size: 0,
						date: new Date()
					},
					add: true
				});
			else if (action.id === 'add-folder')
				showPrompt({
					item: {
						type: 'folder',
						date: new Date()
					},
					add: true
				});
		}
	}

	let options = $derived(
		menuOptions('add').map((option) => {
			option.text = _(option.text);
			return option;
		})
	);
</script>

<div class="wx-wrapper">
	{#if !readonly}
		<div class="wx-button">
			<DropDownMenu {options} at="bottom-fit" onclick={handleClick}>
				<button class="btn">Add New</button>
			</DropDownMenu>
		</div>
	{/if}
	<div class="wx-tree">
		<Tree />
	</div>
	<Drive />
</div>
