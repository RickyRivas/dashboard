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
				errorMessage = '';
				return async ({ result }) => {
					loading = false;
					console.log(result);
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
			<button class="btn" disabled={loading}>Register</button>
		</form>
		{#if errorMessage}
			<ErrorMessage {errorMessage} />
		{/if}
		<p>Already have an account? <a href="/login">log in</a></p>
	</div>
</section>
