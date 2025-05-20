<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';

	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const { sites } = data;

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

<section>
	<div class="container">
		<h1>Sites</h1>
		{#if sites.length}
			<ul>
				{#each sites as site}
					<li>
						<a href="/app/sites/{site.id}">{site.site_name}</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No sites. Go make some sales!!!</p>
		{/if}
	</div>
</section>

<section>
	<div class="container">
		<h2>Add a site</h2>
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
	</div>
</section>
