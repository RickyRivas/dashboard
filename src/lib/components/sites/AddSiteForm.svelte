<script lang="ts">
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import { enhance } from '$app/forms';
	import FormInput from '../form/FormInput.svelte';
	import ErrorMessage from '../form/ErrorMessage.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let { sites = $bindable() } = $props();

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'site_name',
			label: 'Site Name',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Site Name',
			disabled: false,
			error: ''
		}
	]);

	// form ui state
	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');
	let addSiteForm;

	const formHandler = createFormHandler(
		inputConfigs,
		(isLoading) => (loading = isLoading),
		(APIError) => (error = APIError),
		(APISuccess) => (success = APISuccess),
		(message) => (errorMessage = message)
	);
</script>

<form
	method="post"
	class="default-styling"
	action="?/addNewSite"
	bind:this={addSiteForm}
	use:enhance={formHandler}
>
	{#each inputConfigs as { name, label, placeholder, required, disabled, type, oAuthOnly, options, cloudinary }, i}
		<FormInput
			id={name}
			{name}
			{label}
			{placeholder}
			{required}
			{type}
			{options}
			{cloudinary}
			bind:value={inputConfigs[i].value}
			bind:disabled={loading}
			bind:error={inputConfigs[i].error}
			autocomplete="off"
		/>
	{/each}

	{#if errorMessage}
		<ErrorMessage {errorMessage} />
	{/if}

	<button class="btn" disabled={loading}>
		{#if loading}
			<LoadingSpinner bind:loading bind:error bind:success dim={44} />
		{:else}
			<span>Save</span>
		{/if}
	</button>
</form>
