<script lang="ts">
	import { enhance } from '$app/forms';
	import { formHandler } from '$lib/form-helpers';
	import type { FieldDefinition, FormConfig, TriggerUpdate } from '$lib/form-types';
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import AvatarWidget from './AvatarWidget.svelte';
	import Checkbox from './Checkbox.svelte';
	import CheckboxGroup from './CheckboxGroup.svelte';
	import CloudinaryInput from './CloudinaryInput.svelte';
	import CodemirrorTabs from './CodemirrorTabs.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import FormControlInput from './FormControlInput.svelte';
	import FormSelect from './FormSelect.svelte';
	import FormTextarea from './FormTextarea.svelte';
	import HiddenInput from './HiddenInput.svelte';
	import RadioGroup from './RadioGroup.svelte';
	const {
		config,
		name,
		clearOnSuccess = false,
		triggerUpdate,
		onSuccess,
		classes = ['default-styling']
	}: {
		config: FormConfig;
		name: string;
		clearOnSuccess?: boolean;
		triggerUpdate: TriggerUpdate;
		onSuccess?: (result: any) => void | Promise<void>;
		classes?: string[];
	} = $props();
	const { formState, fieldDefinitions, formAttributes } = config;

	// dynamically create codemirror widget
	let renderCodemirrorWidget = $state(false);
	const codemirrorWidgetType = 'codemirror-widget-tab';

	let codeMirrorWidgetTabs: FieldDefinition[] = [];
	config.fieldDefinitions.forEach((field: FieldDefinition, index: number) => {
		if (field.configuration.inputAttributes.type === codemirrorWidgetType) {
			// index is needed to update the config
			codeMirrorWidgetTabs.push({ ...field, index });
		}
	});

	if (codeMirrorWidgetTabs.length) renderCodemirrorWidget = true;
</script>

<form
	{...formAttributes}
	use:enhance={formHandler(config, onSuccess, clearOnSuccess)}
	class={classes.join(' ')}
	data-form-name={name}
>
	<!-- fields/widgets -->
	{#each fieldDefinitions as { fieldState, configuration }, index}
		{#if configuration.inputAttributes.type === 'text' || configuration.inputAttributes.type === 'tel' || configuration.inputAttributes.type === 'phone' || configuration.inputAttributes.type === 'email' || configuration.inputAttributes.type === 'date' || configuration.inputAttributes.type === 'number' || configuration.inputAttributes.type === 'time' || configuration.inputAttributes.type === 'password' || configuration.inputAttributes.type === 'url'}
			<FormControlInput {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'textarea'}
			<FormTextarea {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'radio-group'}
			<RadioGroup {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'checkbox'}
			<!-- single checkbox -->
			<Checkbox {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'checkbox-group'}
			<!-- multi checkbox -->
			<CheckboxGroup {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'select'}
			<FormSelect {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'cloudinary-upload'}
			<CloudinaryInput {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'hidden'}
			<HiddenInput {configuration} {fieldState} {index} {triggerUpdate} />
		{:else if configuration.inputAttributes.type === 'avatar-widget'}
			<AvatarWidget {configuration} {fieldState} {index} {triggerUpdate} />
		{/if}
	{/each}

	<!-- special codemirror tabs widget -->
	{#if renderCodemirrorWidget}
		<CodemirrorTabs {codeMirrorWidgetTabs} {triggerUpdate} />
	{/if}

	{#if formState.statusMessage && formState.hasError}
		<ErrorMessage errorMessage={formState.statusMessage} />
	{/if}

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
