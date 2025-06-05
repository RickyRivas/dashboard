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

<div class="form-control">
	<label>
		{configuration.labelConfig.text}
		<select
			name={configuration.inputAttributes.name}
			class:success={fieldState.showSuccess}
			class:error={fieldState.hasError}
			disabled={configuration.inputAttributes.disabled}
			bind:value
		>
			<option value="">Please select an option</option>
			{#if configuration.inputAttributes.options?.length}
				{#each configuration.inputAttributes.options as { name, label, value: optionValue, disabled }}
					<option value={optionValue}>{label}</option>
				{/each}
			{/if}
		</select>
	</label>

	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
