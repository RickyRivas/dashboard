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
</script>

<div class="form-control">
	<fieldset>
		<legend>
			{configuration.labelConfig.text}
		</legend>
		{#if configuration.inputAttributes.options?.length}
			<div class="form-checkbox-group">
				{#each configuration.inputAttributes.options as { name, label, value: optionValue, disabled }}
					<label>
						<input
							type="checkbox"
							name={configuration.inputAttributes.name}
							bind:group={value}
							value={optionValue}
							{disabled}
						/>
						{label}
					</label>
				{/each}
			</div>
		{:else}
			<p>No options.</p>
		{/if}
	</fieldset>
	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
