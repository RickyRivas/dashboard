<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	let loading = $state(false);
	let errorMessage = $state('');

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'email',
			label: 'Email Address',
			type: 'email',
			value: '',
			required: true,
			placeholder: 'Email Address',
			disabled: false,
			error: '',
			autocomplete: 'email'
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			value: '',
			required: true,
			placeholder: 'Password',
			disabled: false,
			error: '',
			autocomplete: 'current-password'
		}
	]);
</script>

<section>
	<div class="container">
		<h1>Sign in</h1>
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				loading = true;
				errorMessage = '';
				return async ({ result }) => {
					loading = false;

					// upon successful login, redirect
					if (result.type === 'redirect') {
						goto(result.location);
					} else {
						if (result.data.errorFields) {
							inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.errorFields);
						} else {
							errorMessage = result.data.message;
						}
					}
				};
			}}
		>
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
			<button class="auth-submit-btn btn" disabled={loading}> Sign In </button>
		</form>
		<p><a href="/forgot-password">Forgot password?</a></p>
		<p>Don't have an account? <a href="/register">Register</a></p>
		{#if errorMessage}
			<ErrorMessage {errorMessage} />
		{/if}
	</div>
</section>
