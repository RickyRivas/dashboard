<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import type { SiteInformation } from '$lib/types';
	import ErrorMessage from '../form/ErrorMessage.svelte';
	import FormInput from '../form/FormInput.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	let { site_information }: { site_information: SiteInformation } = $props();

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'domain_name',
			label: 'Domain Name',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'example.com',
			disabled: false,
			error: ''
		},
		{
			name: 'start_date',
			label: 'Start Date',
			type: 'date',
			value: '',
			required: false,
			placeholder: '',
			disabled: false,
			error: ''
		},
		{
			name: 'estimated_end_date',
			label: 'Estimated End Date',
			type: 'date',
			value: '',
			required: false,
			placeholder: '',
			disabled: false,
			error: ''
		},
		{
			name: 'launch_date',
			label: 'Launch Date',
			type: 'date',
			value: '',
			required: false,
			placeholder: '',
			disabled: false,
			error: ''
		},
		{
			name: 'website_status',
			label: 'Website Status',
			type: 'select',
			options: [
				'planning',
				'in_development',
				'review',
				'staging',
				'launched',
				'maintenance',
				'archived'
			],
			optionLabels: [
				'Planning',
				'In Development',
				'Review',
				'Staging',
				'Launched',
				'Maintenance',
				'Archived'
			],
			value: '',
			required: false,
			placeholder: 'Select status',
			disabled: false,
			error: ''
		},
		{
			name: 'spec_url',
			label: 'SPEC URL',
			type: 'url',
			value: '',
			required: false,
			placeholder: 'https://docs.google.com/document/...',
			disabled: false,
			error: ''
		},
		{
			name: 'build_link',
			label: 'Build Link',
			type: 'url',
			value: '',
			required: false,
			placeholder: 'https://dev.example.com',
			disabled: false,
			error: ''
		},
		{
			name: 'proof_link',
			label: 'Proof Link',
			type: 'url',
			value: '',
			required: false,
			placeholder: 'https://proof.example.com',
			disabled: false,
			error: ''
		},
		{
			name: 'hosting_provider',
			label: 'Hosting Provider',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Vercel, Netlify, AWS, etc.',
			disabled: false,
			error: ''
		},
		{
			name: 'cms_platform',
			label: 'CMS Platform',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'WordPress, Strapi, Contentful, etc.',
			disabled: false,
			error: ''
		},
		{
			name: 'analytics_id',
			label: 'Analytics ID',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'GA-12345678',
			disabled: false,
			error: ''
		},
		{
			name: 'project_notes',
			label: 'Project Notes',
			type: 'textarea',
			value: '',
			required: false,
			placeholder: 'Add any additional notes about this project...',
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
	if (site_information) {
		for (const [key, value] of Object.entries(site_information)) {
			const formInput = inputConfigs.find((i) => i.name === key);
			if (formInput) formInput.value = value;
		}
	}
</script>

<form method="post" class="default-styling" action="?/updateSiteInfo" use:enhance={formHandler}>
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
