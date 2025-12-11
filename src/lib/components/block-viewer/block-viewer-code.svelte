<script lang="ts">
	import CopyButton from '../code/CopyButton.svelte';
	import BlockViewerCodeEditor from './block-viewer-code-editor.svelte';
	const { html, css, javascript } = $props();

	// tabbable component for langs

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

<div class="block-viewer__code">
	<!-- Code Panel -->
	<div class="block-viewer__code-tabs">
		{#each tabs as tab}
			<button
				class="block-viewer__code-tabs-tab"
				type="button"
				class:block-viewer__code-tabs-tab--active={selectedTab.index === tab.index}
				onclick={() => {
					selectedTab = tab;
				}}
			>
				{tab.lang}
			</button>
		{/each}
		<CopyButton
			minimize={true}
			lang={selectedTab.lang}
			snippet={selectedTab.value}
			text="Copy {selectedTab.lang.toUpperCase()}"
		/>
	</div>

	<BlockViewerCodeEditor
		readonly={true}
		doc={value.toString()}
		lang={selectedTab.lang}
		onupdatevalue={(newValue) => {}}
	/>
</div>
