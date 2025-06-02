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
	<fieldset>
		<legend>
			{configuration.labelConfig.text}
		</legend>
		<div class="form-radio-group">
			{#if configuration.inputAttributes.options?.length}
				{#each configuration.inputAttributes.options as { name, label, value: optionValue, disabled }}
					<label>
						<input type="radio" {name} bind:group={value} value={optionValue} />
						{label}
					</label>
				{/each}
			{:else}
				<p>No options.</p>
			{/if}
		</div>
	</fieldset>
	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
