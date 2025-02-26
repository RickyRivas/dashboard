<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';

	// page will be called after hitting our endpoint from the reset email
	let loading = $state(false);
	let errorMessage = $state('');

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'newPassword',
			label: 'Password',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Password',
			disabled: false,
			error: '',
			autoComplete: 'new-password'
		},
		{
			name: 'confirmPassword',
			label: 'Confirm Password',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Confirm Password',
			disabled: false,
			error: ''
		}
	]);

	const { data } = $props();
	console.log(data);
</script>

<h1>Please reset your password below.</h1>
<form
	action="?/resetPassword"
	method="post"
	use:enhance={async ({ cancel }) => {
		loading = true;

		return async ({ result }) => {
			loading = false;
			console.log(result);
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				if (result.data.validationErrors) {
					inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.validationErrors);
				} else {
					errorMessage = result.data.message;
				}
			}
		};
	}}
>
	{#each inputConfigs as { name, label, placeholder, required, disabled, type }, i}
		<FormInput
			{name}
			{label}
			{placeholder}
			{required}
			{type}
			bind:value={inputConfigs[i].value}
			bind:disabled={loading}
			bind:error={inputConfigs[i].error}
		/>
	{/each}
	{#if errorMessage}
		<ErrorMessage {errorMessage} />
	{/if}
	<button class="btn" disabled={loading}>Update</button>
</form>
