<script lang="ts">
	import ContentEditor from '$lib/components/content-editor/ContentEditor.svelte';
	import { createSettingsStore } from '$lib/components/content-editor/settingsStore';
	import { setContext } from 'svelte';

	let { id, sub = false }: { id: number; sub?: boolean } = $props();

	// Lexical Editor
	const settings = createSettingsStore();
	settings.setOption('emptyEditor', false);
	setContext('settings', settings);

	let value = $state('');
</script>

<div class="form-control">
	<ContentEditor
		onUpdateValue={(newValue) => {
			value = JSON.stringify(newValue);
		}}
	/>
	<input type="hidden" name="field-{id}-value" bind:value />
</div>
