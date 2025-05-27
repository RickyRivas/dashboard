<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { createFormHandler } from '$lib/form-helpers';
	import type { Site, SitePage } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site,
		page
	}: {
		site: Site;
		page: SitePage;
	} = data;

	console.log(page);

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	let inputConfigs = $state([
		{
			name: 'title',
			label: 'Page Title*',
			type: 'text',
			value: page?.title || '',
			required: true,
			placeholder: 'Enter page title',
			disabled: false,
			error: ''
		},
		{
			name: 'slug',
			label: 'Page Slug*',
			type: 'text',
			value: page?.slug || '',
			required: true,
			placeholder: 'page-url-slug',
			disabled: false,
			error: ''
		},
		{
			name: 'parent_id',
			label: 'Parent Page',
			type: 'select',
			options: [], // Populated with available parent pages
			optionLabels: [], // Populated with parent page titles
			value: page?.parent_id || '',
			required: false,
			placeholder: 'Select parent page (optional)',
			disabled: false,
			error: ''
		},
		{
			name: 'page_type',
			label: 'Page Type',
			type: 'select',
			options: ['standard', 'blog', 'landing', 'contact', 'about', 'services'],
			optionLabels: [
				'Standard Page',
				'Blog Post',
				'Landing Page',
				'Contact Page',
				'About Page',
				'Services Page'
			],
			value: page?.page_type || 'standard',
			required: false,
			placeholder: 'Select page type',
			disabled: false,
			error: ''
		},
		{
			name: 'content',
			label: 'Page Content',
			type: 'textarea',
			value: page?.content ? JSON.stringify(page.content, null, 2) : '',
			required: false,
			placeholder: 'Enter page content (JSON format for now)',
			disabled: false,
			error: '',
			rows: 10
		},
		{
			name: 'meta_title',
			label: 'SEO Title',
			type: 'text',
			value: page?.meta_title || '',
			required: false,
			placeholder: 'Custom SEO title (optional)',
			disabled: false,
			error: ''
		},
		{
			name: 'meta_description',
			label: 'Meta Description',
			type: 'textarea',
			value: page?.meta_description || '',
			required: false,
			placeholder: 'Brief description for search engines (150-160 characters)',
			disabled: false,
			error: '',
			rows: 3
		},
		{
			name: 'featured_image',
			label: 'Featured Image URL',
			type: 'text',
			value: page?.featured_image || '',
			required: false,
			placeholder: 'https://example.com/image.jpg',
			disabled: false,
			error: '',
			cloudinary: true // If you want to use your cloudinary integration
		},
		{
			name: 'template',
			label: 'Page Template',
			type: 'select',
			options: ['default', 'full-width', 'sidebar-left', 'sidebar-right', 'landing', 'minimal'],
			optionLabels: [
				'Default',
				'Full Width',
				'Sidebar Left',
				'Sidebar Right',
				'Landing Page',
				'Minimal'
			],
			value: page?.template || 'default',
			required: false,
			placeholder: 'Select page template',
			disabled: false,
			error: ''
		},
		{
			name: 'display_order',
			label: 'Display Order',
			type: 'number',
			value: page?.display_order || 0,
			required: false,
			placeholder: '0',
			disabled: false,
			error: '',
			min: 0
		},
		{
			name: 'is_published',
			label: 'Published',
			type: 'checkbox',
			value: page?.is_published || false,
			required: false,
			placeholder: '',
			disabled: false,
			error: ''
		},
		{
			name: 'is_homepage',
			label: 'Set as Homepage',
			type: 'checkbox',
			value: page?.is_homepage || false,
			required: false,
			placeholder: '',
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
</script>

<section>
	<div class="container">
		<h1>Editing {page.title} page</h1>
		<p>account: {site.site_name}</p>
		<form method="post" class="default-styling" action="?/updatePage" use:enhance={formHandler}>
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
		<a class="btn" href="/app/sites/{site.id}">Go back</a>
	</div>
</section>
