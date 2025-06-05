<script lang="ts">
	import type { FormConfig, TriggerUpdate } from '$lib/form-types';
	import AutoFormInput from './AutoFormInput.svelte';
	import AutoFormSelect from './AutoFormSelect.svelte';
	// field of inputs that auto submit a form based on event

	const {
		config,
		name,
		clearOnSuccess = true,
		triggerUpdate,
		onSuccess,
		classes = ['auto-form-group']
	}: {
		config: FormConfig;
		name: string;
		clearOnSuccess?: boolean;
		triggerUpdate: TriggerUpdate;
		onSuccess?: (result: any) => void | Promise<void>;
		classes?: string[];
	} = $props();
	const { formState, fieldDefinitions, formAttributes } = config;
</script>

<div class={classes.join(' ')}>
	{#each fieldDefinitions as { fieldState, configuration }, index}
		{#if configuration.inputAttributes.type === 'text' || configuration.inputAttributes.type === 'tel' || configuration.inputAttributes.type === 'phone' || configuration.inputAttributes.type === 'email' || configuration.inputAttributes.type === 'date' || configuration.inputAttributes.type === 'number' || configuration.inputAttributes.type === 'time' || configuration.inputAttributes.type === 'password'}
			<AutoFormInput {configuration} {fieldState} {index} {triggerUpdate} {config} />
		{:else if configuration.inputAttributes.type === 'select'}
			<AutoFormSelect {configuration} {fieldState} {index} {triggerUpdate} {config} />
		{/if}
	{/each}
</div>
