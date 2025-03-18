<script lang="ts">
	// layout
	import SettingsLayout from '$lib/layouts/SettingsLayout.svelte';

	// components
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';

	// helpers
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';

	// svelte imports
	import { page } from '$app/state';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { appAvailableProviders } from '$lib/auth-controller';

	// supabase
	import type { User } from '@supabase/supabase-js';

	// cloudinary
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';

	let editing = $state(false);
	let loading = $state(false);
	let updateProfileForm: HTMLFormElement;
	let resetPasswordForm: HTMLFormElement;
	let showDeleteAccountForm = $state(false);

	let { data }: { data: PageData } = $props();
	let { user }: { user: User } = data;

	// providers
	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);

	// delete account form config
	import { deleteAccountFormConfig, profileSettingsInputConfigs } from '$lib/form-configs';
	let deleteInputConfigs = $state(deleteAccountFormConfig);

	// profile form
	let inputConfigs: InputConfig[] = $state(profileSettingsInputConfigs);

	inputConfigs[0].value = page.data.profile.full_name;
	inputConfigs[1].value = user.email as string;
	inputConfigs[1].oAuthOnly = !hasEmailAuthentication;

	// send reset password request
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

	$effect(() => {
		// clear errors when we toggle off editing
		if (!editing) inputConfigs.forEach((config) => (config.error = ''));
		avatar_url = page.data.profile.avatar_url;
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
							<div class="small-avatar">
								<img
									src={page.data.profile.avatar_url || '/images/avatar-placeholder.jpg'}
									alt={page.data.profile.full_name || 'placeholder'}
									width="40"
									height="40"
									decoding="async"
								/>
							</div>
						</td>
					</tr>
					<tr>
						<td>Name:</td>
						<td>{page.data.profile.full_name}</td>
					</tr>
					<tr>
						<td>Email:</td>
						<td>{user.email}</td>
					</tr>
					{#if hasEmailAuthentication}
						<tr>
							<td>Password:</td>
							<td>***</td>
						</tr>
					{/if}
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
						}

						if (result.data.errors) {
							inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.errors);
						}
					};
				}}
			>
				{#if !hasEmailAuthentication}
					<input type="hidden" name="oauth-only" value={true} />
				{/if}

				<input type="hidden" name="avatar_url" bind:value={avatar_url} />
				{#if avatar_url}
					<div class="small-avatar">
						<img src={avatar_url} alt={page.data.profile.full_name} width="40" height="40" />
					</div>
				{/if}
				<button onclick={handleClick} type="button" class="btn"> Upload Image</button>

				{#each inputConfigs as { name, label, placeholder, required, disabled, type, oAuthOnly }, i}
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
						autocomplete="off"
						oauthUserDisable={oAuthOnly}
					/>
				{/each}

				{#if hasEmailAuthentication}
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
				{/if}

				<button class="btn">Save</button>
				<button
					type="button"
					class="btn"
					onclick={() => {
						editing = false;
					}}
				>
					Cancel
				</button>
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
				Edit Profile
			</button>
		{/if}

		<!-- -->
		<h2>Connected accounts:</h2>
		<table>
			<tbody>
				{#each appAvailableProviders as provider}
					<tr>
						<td style="text-transform: capitalize;">{provider.name}</td>
						<td>
							{user.identities?.some((i) => i.provider === provider.name)
								? 'Connected'
								: 'Not Connected'}
							{#if !user.identities?.some((i) => i.provider === provider.name)}
								<form
									class="custom inline"
									action="?/linkProvider"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'redirect') {
												window.location = result.location;
											}
										};
									}}
								>
									<input type="hidden" name="provider" value={provider.name} />
									<button class="btn">Link</button>
								</form>
							{:else}
								<form
									class="custom inline"
									action="?/unlinkProvider"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'redirect') {
												window.location = result.location;
											}
										};
									}}
								>
									<input type="hidden" name="provider" value={provider.name} />
									<button class="btn">Unlink</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- -->
		<h2>Danger</h2>
		{#if showDeleteAccountForm}
			<AuthForm
				action="?/deleteAccount"
				submitButtonText="Delete Account"
				bind:inputConfigs={deleteInputConfigs}
			/>
			<button class="btn" onclick={() => (showDeleteAccountForm = false)}>Cancel</button>
		{:else}
			<button class="btn" onclick={() => (showDeleteAccountForm = !showDeleteAccountForm)}>
				Delete Account
			</button>
		{/if}
	{/snippet}
</SettingsLayout>

<form
	bind:this={resetPasswordForm}
	action="?/sendPasswordResetRequest"
	class="screenreader custom"
	method="post"
	use:enhance={() => {
		sendPasswordRequestLoading = true;
		return async ({ result }) => {
			sendPasswordRequestLoading = false;
			if (result.status === 200) sendPasswordRequestState = 'Please check your email.';
			else sendPasswordRequestState = 'Something went wrong.';
		};
	}}
>
	<input type="hidden" name="" />
</form>
