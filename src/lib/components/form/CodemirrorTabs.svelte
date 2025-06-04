<script lang="ts">
	import type { FieldDefinition, TriggerUpdate } from '$lib/form-types';
	import CodeEditor from '../CodeEditor.svelte';

	const {
		codeMirrorWidgetTabs,
		triggerUpdate
	}: { codeMirrorWidgetTabs: FieldDefinition[]; triggerUpdate: TriggerUpdate } = $props();

	let selectedTab = $state(codeMirrorWidgetTabs[0]);
	let value = $derived(selectedTab.configuration.inputAttributes.value);
</script>

<div class="form-control">
	<div class="manager-editor-lang-btns">
		<fieldset>
			<legend>Code</legend>
			{#each codeMirrorWidgetTabs as tab}
				<input
					type="hidden"
					name={tab.configuration.inputAttributes.name}
					value={tab.configuration.inputAttributes.value}
				/>
				<button
					class="btn"
					type="button"
					class:active={selectedTab.index === tab.index}
					onclick={() => {
						selectedTab = tab;
					}}
				>
					{tab.configuration.inputAttributes.codeMirrorLang}
				</button>
			{/each}
		</fieldset>
	</div>

	<CodeEditor
		doc={value.toString()}
		lang={selectedTab.configuration.inputAttributes.codeMirrorLang}
		onupdatevalue={(newValue) => {
			if (selectedTab.index) triggerUpdate(selectedTab.index, newValue);
		}}
	/>
</div>
