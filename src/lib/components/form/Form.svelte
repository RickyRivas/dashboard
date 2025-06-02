<script lang="ts">
	import { enhance } from '$app/forms';
	import { formHandler } from '$lib/form-helpers';
	import type { FormConfig, TriggerUpdate } from '$lib/form-types';
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import CheckboxGroup from './CheckboxGroup.svelte';
	import CloudinaryInput from './CloudinaryInput.svelte';
	import FormControlInput from './FormControlInput.svelte';
	import FormSelect from './FormSelect.svelte';
	import FormTextarea from './FormTextarea.svelte';
	import RadioGroup from './RadioGroup.svelte';
	const {
		config,
		name,
		triggerUpdate
	}: { config: FormConfig; name: string; triggerUpdate: TriggerUpdate } = $props();
	const { formState, fieldDefinitions, formAttributes } = config;
</script>

<form
	{...formAttributes}
	use:enhance={formHandler(config)}
	class="default-styling"
	data-form-name={name}
>
	<!-- fields/widgets -->
	{#each fieldDefinitions as { fieldState, configuration }, index}
		{#if configuration.inputAttributes.type === 'text' || configuration.inputAttributes.type === 'tel' || configuration.inputAttributes.type === 'phone' || configuration.inputAttributes.type === 'email'}
			<FormControlInput {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'textarea'}
			<FormTextarea {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'radio-group'}
			<RadioGroup {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'checkbox-group'}
			<CheckboxGroup {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'select'}
			<FormSelect {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'cloudinary-upload'}
			<CloudinaryInput {configuration} {fieldState} {index} {triggerUpdate} />
		{:else}
			<p>Invalid field.</p>
		{/if}
	{/each}

	<!-- submit -->
	<button
		class="btn"
		disabled={formState.isDisabled}
		class:error={formState.hasError}
		class:success={formState.showSuccess}
	>
		{#if formState.isLoading}
			<LoadingSpinner
				dim={44}
				loading={formState.isLoading}
				success={formState.showSuccess}
				error={formState.hasError}
			/>
		{:else}
			<span>{formState.submitButtonText}</span>
		{/if}
	</button>
</form>
