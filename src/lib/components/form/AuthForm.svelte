<script lang="ts">
	import { enhance } from '$app/forms';
	import { appAvailableProviders } from '$lib/auth-controller';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import FormInput from './FormInput.svelte';

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);
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
		(APIError) => (error = APIError),
		(APISuccess) => (success = APISuccess),
		(message) => (errorMessage = message)
	);

	let oauthForm;
</script>

<form class="default-styling" method="post" {action} use:enhance={formHandler}>
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

	<button class="btn" disabled={loading}>
		{#if loading}
			<LoadingSpinner dim={44} bind:loading bind:success bind:error />
		{:else}
			<span>{submitButtonText}</span>
		{/if}
	</button>

	{#if errorMessage}
		<ErrorMessage {errorMessage} />
	{/if}

	{#if oAuth}
		<div class="auth-form-divider">
			<hr />
			<span>Or</span>
			<hr />
		</div>
		<div class="auth-providers-group">
			{#each appAvailableProviders as provider}
				<a class="btn" href="/auth/{provider.name}?signin">Sign in with {provider.name}</a>
			{/each}
		</div>
	{/if}
</form>

<!-- form footer content-->
{#if footerContent}
	<div class="form-footer">
		{@html footerContent}
	</div>
{/if}
