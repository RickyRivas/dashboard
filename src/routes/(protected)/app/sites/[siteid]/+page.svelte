<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ContactsForm from '$lib/components/sites/ContactsForm.svelte';
	import InformationForm from '$lib/components/sites/InformationForm.svelte';
	import SiteChecklist from '$lib/components/sites/SiteChecklist.svelte';
	import SiteGuides from '$lib/components/sites/SiteGuides.svelte';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import type {
		Site,
		SiteContacts,
		SiteInformation,
		SitePage,
		SiteProcessChecklist
	} from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site,
		site_pages,
		site_contacts,
		site_information,
		site_checklist
	}: {
		site: Site;
		site_pages: SitePage[];
		site_contacts: SiteContacts;
		site_information: SiteInformation;
		site_checklist: SiteProcessChecklist;
	} = data;

	// form ui state
	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');
	let addPageForm;

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'title',
			label: 'Title',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Title',
			disabled: false,
			error: ''
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'slug',
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
		<h1>Account: {site.site_name}</h1>
		<hr />

		<h2>Contact Info:</h2>
		{#if site_contacts}
			<ContactsForm {site_contacts} />
		{:else}
			<p>Site contacts unavailable.</p>
		{/if}
		<hr />

		<h2>Site Information:</h2>
		{#if site_information}
			<InformationForm {site_information} />
		{:else}
			<p>Site information unavailable.</p>
		{/if}
		<hr />

		<h2>Site Checklist</h2>
		{#if site_checklist}
			<SiteChecklist {site_checklist} />
		{:else}
			<p>Site checklist unavailable.</p>
		{/if}
		<hr />

		<h2>Pages</h2>
		<p>All <a href="/app/sites/{site.id}/pages">pages</a> for {site.site_name}</p>
		{#if site_pages.length}
			<ul>
				{#each site_pages as page}
					<li>
						<h2>{page.title}</h2>
						<div>display order: {page.display_order}</div>
						<input type="text" value={page.display_order} />
						<div>parent id: {page.parent_id || 'Top Level. No Parent ID'}</div>
						<a href="/app/sites/{site.id}/pages/{page.id}">Edit page</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No pages.</p>
		{/if}

		<h3>Add a page</h3>
		<form
			method="post"
			class="default-styling"
			action="?/addNewPage"
			bind:this={addPageForm}
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

		<a href="/app/sites" class="btn">View all sites</a>
	</div>
</section>
