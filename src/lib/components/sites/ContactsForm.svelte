<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormHandler, handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import type { SiteContacts } from '$lib/types';
	import ErrorMessage from '../form/ErrorMessage.svelte';
	import FormInput from '../form/FormInput.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	let { site_contacts }: { site_contacts: SiteContacts } = $props();

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'primary_contact_name',
			label: 'Primary Contact',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'John Doe',
			disabled: false,
			error: ''
		},
		{
			name: 'primary_phone',
			label: 'Primary Phone',
			type: 'tel',
			value: '',
			required: false,
			placeholder: '(555) 123-4567',
			disabled: false,
			error: ''
		},
		{
			name: 'primary_email',
			label: 'Primary Email',
			type: 'email',
			value: '',
			required: false,
			placeholder: 'john.doe@example.com',
			disabled: false,
			error: ''
		},
		{
			name: 'secondary_contact_name',
			label: 'Secondary Contact',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Jane Smith',
			disabled: false,
			error: ''
		},
		{
			name: 'secondary_phone',
			label: 'Secondary Phone',
			type: 'tel',
			value: '',
			required: false,
			placeholder: '(555) 987-6543',
			disabled: false,
			error: ''
		},
		{
			name: 'secondary_email',
			label: 'Secondary Email',
			type: 'email',
			value: '',
			required: false,
			placeholder: 'jane.smith@example.com',
			disabled: false,
			error: ''
		},
		{
			name: 'business_address',
			label: 'Business Address',
			type: 'textarea', // Using textarea for addresses to give more space
			value: '',
			required: false,
			placeholder: '123 Business St, Suite 101, City, State 12345',
			disabled: false,
			error: ''
		},
		{
			name: 'business_phone',
			label: 'Business Phone',
			type: 'tel',
			value: '',
			required: false,
			placeholder: '(555) 555-5555',
			disabled: false,
			error: ''
		},
		{
			name: 'business_email',
			label: 'Business Email',
			type: 'email',
			value: '',
			required: false,
			placeholder: 'contact@business.com',
			disabled: false,
			error: ''
		},
		{
			name: 'preferred_contact_method',
			label: 'Preferred Contact Method',
			type: 'select',
			options: [
				'primary_phone',
				'primary_email',
				'secondary_phone',
				'secondary_email',
				'business_phone',
				'business_email'
			],
			optionLabels: [
				'Primary Phone',
				'Primary Email',
				'Secondary Phone',
				'Secondary Email',
				'Business Phone',
				'Business Email'
			],
			value: 'primary_email',
			required: false,
			placeholder: 'Select preferred contact method',
			disabled: false,
			error: ''
		}
	]);

	const formHandler = createFormHandler(
		inputConfigs,
		(isLoading) => (loading = isLoading),
		(APIError) => (error = APIError),
		(APISuccess) => (success = APISuccess),
		(message) => (errorMessage = message)
	);

	// prefill
	if (site_contacts) {
		for (const [key, value] of Object.entries(site_contacts)) {
			const formInput = inputConfigs.find((i) => i.name === key);
			if (formInput) formInput.value = value;
		}
	}
</script>

<form method="post" class="default-styling" action="?/updateContacts" use:enhance={formHandler}>
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
