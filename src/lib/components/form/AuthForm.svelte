<script lang="ts">
	import { enhance } from '$app/forms';
	import { appAvailableProviders } from '$lib/auth-controller';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import ErrorMessage from './ErrorMessage.svelte';
	import FormInput from './FormInput.svelte';

	let loading = $state(false);
	let errorMessage = $state('');
	let {
		action,
		inputConfigs = $bindable(),
		submitButtonText = 'Submit',
		footerContent,
		showRememberMe = false,
		oAuth = false
	}: {
		action: string;
		inputConfigs: InputConfig[];
		submitButtonText: string;
		footerContent?: string;
		showRememberMe?: boolean;
		oAuth?: boolean;
	} = $props();

	const formHandler = createFormHandler(
		inputConfigs,
		(isLoading) => (loading = isLoading),
		(message) => (errorMessage = message)
	);

	let oauthForm;
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

	{#if showRememberMe}
		<div class="form-control">
			<label for="rememberme">
				<input type="checkbox" name="rememberme" id="rememberme" />
				Remember me
			</label>
		</div>
	{/if}

	<button class="btn" disabled={loading}>{submitButtonText}</button>
</form>

{#if errorMessage}
	<ErrorMessage {errorMessage} />
{/if}

{#if oAuth}
	<div>or sign in with a provider</div>
	<div class="oauth-providers">
		<form
			action="?/oauthSignin"
			method="post"
			bind:this={oauthForm}
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'redirect') {
						window.location = result.location;
					}
				};
			}}
		>
			{#each appAvailableProviders as provider}
				<label for="provider-{provider.name}">
					<input
						type="radio"
						name="selected-provider"
						value={provider.name}
						onchange={() => {
							oauthForm.requestSubmit();
						}}
					/>
					Sign in with {provider.name}
				</label>
			{/each}
		</form>
	</div>
{/if}

<!-- form footer content-->
{#if footerContent}
	<div class="form-footer">
		{@html footerContent}
	</div>
{/if}
