<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import ErrorMessage from './ErrorMessage.svelte';
	import FormInput from './FormInput.svelte';

	let loading = $state(false);
	let errorMessage = $state('');
	let {
		action,
		inputConfigs = $bindable(),
		submitButtonText = 'Submit',
		footerContent
	}: {
		action: string;
		inputConfigs: InputConfig[];
		submitButtonText: string;
		footerContent?: string;
	} = $props();

	const formHandler = createFormHandler(
		inputConfigs,
		(isLoading) => (loading = isLoading),
		(message) => (errorMessage = message)
	);
</script>

<form method="post" {action} use:enhance={formHandler}>
	{#each inputConfigs as { name, label, placeholder, required, disabled, type, autocomplete }, i}
		<FormInput
			id={name}
			{name}
			{label}
			{placeholder}
			{required}
			{type}
			{autocomplete}
			bind:value={inputConfigs[i].value}
			bind:disabled={loading}
			bind:error={inputConfigs[i].error}
		/>
	{/each}
	<button class="btn" disabled={loading}>{submitButtonText}</button>
</form>

{#if errorMessage}
	<ErrorMessage {errorMessage} />
{/if}

<!-- form footer content-->
{#if footerContent}
	<div class="form-footer">
		{@html footerContent}
	</div>
{/if}
