<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';

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
			error: ''
		}
	]);
</script>

<section>
	<div class="container">
		<h1>Forgot password</h1>
		<form
			method="post"
			action="?/passwordResetRequest"
			use:enhance={async ({ cancel }) => {
				loading = true;

				return async ({ result }) => {
					loading = false;

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
			<button class="btn">Send Password Reset Link</button>
		</form>
		<p>Take me back to <a href="/login">Login</a>.</p>
	</div>
</section>
