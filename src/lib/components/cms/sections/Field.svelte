<script lang="ts">
	import type { fieldType } from '$lib/types';
	import FieldContentEntry from './field-entries/FieldContentEntry.svelte';
	import FieldBaseInputs from './FieldBaseInputs.svelte';
	import FieldTextEntry from './field-entries/FieldTextEntry.svelte';
	import SubFieldList from './SubFieldList.svelte';

	let { id, sub = false } = $props();

	// create fields def
	let selectedfieldType: fieldType = $state('text');
</script>

<!-- is a form field -->
<div class="create-field">
	<!-- Type, Label & Key -->
	<FieldBaseInputs
		onUpdateSelectedfieldType={(newValue: fieldType) => {
			selectedfieldType = newValue;
		}}
		{id}
	/>

	<!-- Metadata for specific field type -->

	<!-- Type Entry - will also handle metadata -->
	<div class="create-field__entry">
		{#if selectedfieldType === 'text'}
			<FieldTextEntry {id} {sub} />
		{:else if selectedfieldType === 'content'}
			<FieldContentEntry {id} {sub} />
		{:else if selectedfieldType === 'repeater'}
			<SubFieldList {id} />
		{/if}
	</div>
</div>
