<script lang="ts">
	import SettingsLayout from '$lib/layouts/SettingsLayout.svelte';
	import type { User } from '@supabase/supabase-js';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { onMount } from 'svelte';

	let editing = $state(false);
	let loading = $state(false);
	let updateProfileForm: HTMLFormElement;
	let resetPasswordForm: HTMLFormElement;

	let { data }: { data: PageData } = $props();
	let { user }: { user: User } = data;

	const hasPassword = Boolean(
		// Check if they initially signed up with email
		user.app_metadata.provider === 'email' ||
			// Check if password is in their auth methods
			user.app_metadata.providers?.includes('email') ||
			// Check AMR for password auth
			user.amr?.some((method) => method.method === 'password')
	);

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'full_name',
			label: 'Name',
			type: 'text',
			value: page.data.profile.full_name,
			required: true,
			placeholder: 'Name',
			disabled: false,
			error: ''
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: user.email,
			required: true,
			placeholder: 'Email',
			disabled: false,
			error: ''
		}
	]);

	$effect(() => {
		// clear errors when we toggle off editing
		if (!editing) {
			inputConfigs.forEach((config) => (config.error = ''));
		}
		// image url
		avatar_url = page.data.profile.avatar_url;
	});

	let sendPasswordRequestState = $state('');
	let sendPasswordRequestLoading = $state(false);

	// cloudinary
	let uploadWidget;
	let avatar_url = $state(page.data.profile.avatar_url);
	let onUpload = (error, result, widget) => {
		if (!error && result) {
			avatar_url = result.info.url;
		}
	};

	function cldCallback(error, result) {
		if (error || result.event === 'success') {
			onUpload && onUpload(error, result, uploadWidget);
		}
	}

	function handleClick() {
		if (uploadWidget) uploadWidget.open();
	}

	configureCloudinary({
		cloudName: 'detngn1i8'
	});

	onMount(() => {
		function onIdle() {
			if (!uploadWidget) {
				uploadWidget = window.cloudinary.createUploadWidget(
					{
						cloudName: 'detngn1i8',
						uploadPreset: 'Snippets'
					},
					cldCallback
				);
			}
		}

		'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);
	});
</script>

<SettingsLayout>
	{#snippet content()}
		<h1>All Settings</h1>
		<h2>Personal Information</h2>
		{#if !editing}
			<table>
				<tbody>
					<tr>
						<td>Avatar:</td>
						<td>
							{#if page.data.profile.avatar_url}
								<div class="small-avatar">
									<img
										src={page.data.profile.avatar_url}
										alt={page.data.profile.full_name}
										width="40"
										height="40"
									/>
								</div>
							{:else}
								No avatar set.
							{/if}
						</td>
					</tr>
					<tr>
						<td>Name:</td>
						<td>{page.data.profile.full_name}</td>
					</tr>
					<tr>
						<td>Email:</td>
						<td>{user.email} {user.email_confirmed_at ? '(Confirmed)' : ''}</td>
					</tr>
					<tr>
						<td>Password:</td>
						{#if hasPassword}
							<td>***</td>
						{:else}
							<td>Password not set.</td>
						{/if}
					</tr>
				</tbody>
			</table>
		{:else}
			<form
				action="?/updateProfile"
				class="custom"
				method="post"
				bind:this={updateProfileForm}
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						loading = false;

						if (result.type === 'success') {
							invalidate('supabase:auth');
							editing = false;
						} else {
							// check for validation and supabase errors
							if (result.data.validationErrors) {
								inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.validationErrors);
							}
							if (result.data.errorFields) {
								inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.errorFields);
							}
						}
					};
				}}
			>
				<input type="hidden" name="avatar_url" bind:value={avatar_url} />
				{#if avatar_url}
					<div class="small-avatar">
						<img src={avatar_url} alt={page.data.profile.full_name} width="40" height="40" />
					</div>
				{/if}
				<button onclick={handleClick} type="button" class="btn"> Upload Image</button>

				{#each inputConfigs as { name, label, placeholder, required, disabled, type }, i}
					<FormInput
						id={name}
						{name}
						{label}
						{placeholder}
						{required}
						{type}
						bind:value={inputConfigs[i].value}
						bind:disabled={loading}
						bind:error={inputConfigs[i].error}
					/>
				{/each}

				<!-- Password -->
				<div class="form-control">
					<label for=""> Password </label>
					<button class="btn" type="button" onclick={() => resetPasswordForm.requestSubmit()}>
						Send Password Reset Request
					</button>
					{#if sendPasswordRequestLoading}
						<span>Sending...</span>
					{/if}
					{#if sendPasswordRequestState}
						<span>{sendPasswordRequestState}</span>
					{/if}
				</div>

				<button class="btn">Save</button>
				<button
					type="button"
					class="btn"
					onclick={() => {
						editing = false;
					}}>Cancel</button
				>
			</form>
		{/if}

		{#if loading}
			<p>Saving...</p>
		{/if}

		{#if !editing}
			<button
				class="btn"
				onclick={() => {
					editing = true;
				}}
			>
				Edit Settings
			</button>
		{/if}

		<h2>Connected Accounts</h2>
		<table>
			<tbody>
				<tr>
					<td>Google</td>
					<td>Not Connected.</td>
				</tr>
			</tbody>
		</table>
	{/snippet}
</SettingsLayout>

<form
	bind:this={resetPasswordForm}
	action="?/sendPasswordResetRequest"
	class="screenreader custom"
	method="post"
	use:enhance={({ cancel }) => {
		sendPasswordRequestLoading = true;
		return async ({ result }) => {
			sendPasswordRequestLoading = false;

			if (result.data.message) {
				sendPasswordRequestState = result.data.message;
			}
		};
	}}
>
	<input type="hidden" name="" />
</form>
