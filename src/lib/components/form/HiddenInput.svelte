<script lang="ts">
	import type { InputAttributes, LabelConfig, FieldState, TriggerUpdate } from '$lib/form-types';
	import ErrorMessage from './ErrorMessage.svelte';

	const {
		configuration,
		fieldState,
		triggerUpdate,
		index
	}: {
		configuration: { inputAttributes: InputAttributes; labelConfig: LabelConfig };
		fieldState: FieldState;
		triggerUpdate: TriggerUpdate;
		index: number;
	} = $props();

	let value = $state(configuration.inputAttributes.value);

	$effect(() => {
		triggerUpdate(index, value);
	});

	// $inspect('c', value);
</script>

<div class="form-control screenreader" style:position="absolute">
	<label>
		<span class="screenreader">
			{configuration.labelConfig.text}
		</span>
		<input
			{...configuration.inputAttributes}
			class:error={fieldState.hasError}
			class:success={fieldState.showSuccess}
			bind:value
		/>
	</label>
	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
