<script lang="ts">
	import type { FieldDefinition, FormConfig, TriggerUpdate } from '$lib/form-types';
	import DisplayAvatar from './DisplayAvatar.svelte';
	import DisplayText from './DisplayText.svelte';

	const {
		config,
		name,
		classes = ['display-form'],
		extraFields
	}: {
		config: FormConfig;
		name: string;
		classes?: string[];
		extraFields?: FieldDefinition[];
	} = $props();
	const { formState, fieldDefinitions, formAttributes } = config;
</script>

<div class={classes.join(' ')} data-form-name={name}>
	<!-- fields/widgets -->
	{#each fieldDefinitions as { fieldState, configuration }, index}
		{#if configuration.inputAttributes.type === 'text' || configuration.inputAttributes.type === 'tel' || configuration.inputAttributes.type === 'phone' || configuration.inputAttributes.type === 'email' || configuration.inputAttributes.type === 'date' || configuration.inputAttributes.type === 'number' || configuration.inputAttributes.type === 'time' || configuration.inputAttributes.type === 'password'}
			<DisplayText {configuration} />
		{:else if configuration.inputAttributes.type === 'avatar-widget'}
			<DisplayAvatar {configuration} />
		{/if}
	{/each}

	{#if extraFields}
		{#each extraFields as { fieldState, configuration }, index}
			{#if configuration.inputAttributes.type === 'text' || configuration.inputAttributes.type === 'tel' || configuration.inputAttributes.type === 'phone' || configuration.inputAttributes.type === 'email' || configuration.inputAttributes.type === 'date' || configuration.inputAttributes.type === 'number' || configuration.inputAttributes.type === 'time' || configuration.inputAttributes.type === 'password'}
				<DisplayText {configuration} />
			{:else if configuration.inputAttributes.type === 'avatar-widget'}
				<DisplayAvatar {configuration} />
			{/if}
		{/each}
	{/if}
</div>
