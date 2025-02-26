<script lang="ts">
	import { enhance } from '$app/forms';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	let loading = $state(false);
	let errorMessage = $state('');
	let successfulRegistration = $state(false);

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'fullName',
			label: 'Full Name',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Full Name',
			disabled: false,
			error: ''
		},
		{
			name: 'email',
			label: 'Email Address',
			type: 'email',
			value: '',
			required: true,
			placeholder: 'Email Address',
			disabled: false,
			error: ''
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
			autocomplete: 'off'
		},
		{
			name: 'passwordConfirmed',
			label: 'Confirm Password',
			type: 'password',
			value: '',
			required: true,
			placeholder: 'Confirm Password',
			disabled: false,
			error: '',
			autocomplete: 'off'
		}
	]);
</script>

<section>
	<div class="container">
		<h1>Register a new account</h1>
		<form
			method="POST"
			action="?/register"
			autocomplete="off"
			use:enhance={() => {
				loading = true;
				// clear errors
				errorMessage = '';
				inputConfigs.forEach((config) => {
					config.error = '';
				});

				return async ({ result }) => {
					loading = false;

					// upon successful login, redirect
					if (result.type === 'success') {
						successfulRegistration = true;
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
			<input type="hidden" name="register-form" />
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
			{#if errorMessage}
				<ErrorMessage {errorMessage} />
			{/if}
			{#if successfulRegistration}
				<div class="success-form-message" style:color="green">
					Check your email for the confirmation link.
				</div>
			{/if}
			<button class="btn" disabled={loading}>Register</button>
		</form>
		<p>Already have an account? <a href="/login">log in</a></p>
	</div>
</section>
