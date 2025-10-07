<script lang="ts">
	import CopyButton from '../code/CopyButton.svelte';
	import UIblockEditor from './UIblockEditor.svelte';
	const { html, css, javascript } = $props();

	// hard coding tabs here. TODO
	type Lang = 'html' | 'css' | 'javascript';
	type Tab = {
		value: string;
		lang: Lang;
		index: number;
	};
	let tabs: Tab[] = [
		{ value: html, lang: 'html', index: 0 },
		{ value: css, lang: 'css', index: 1 },
		{ value: javascript, lang: 'javascript', index: 2 }
	];

	let selectedTab = $state(tabs[0]);
	let value = $derived(selectedTab.value);
</script>

<!-- Code Panel -->
<div class="manager-editor-lang-btns">
	{#each tabs as tab}
		<button
			class="btn"
			type="button"
			class:active={selectedTab.index === tab.index}
			onclick={() => {
				selectedTab = tab;
			}}
		>
			{tab.lang}
		</button>
	{/each}
	<CopyButton
		lang={selectedTab.lang}
		snippet={selectedTab.value}
		text="Copy {selectedTab.lang.toUpperCase()}"
	/>
</div>
<UIblockEditor
	readonly={true}
	doc={value.toString()}
	lang={selectedTab.lang}
	onupdatevalue={(newValue) => {}}
/>
