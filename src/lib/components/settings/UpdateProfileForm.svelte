<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import AvatarWidget from './AvatarWidget.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import type { User } from '@supabase/supabase-js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let {
		editingProfile = $bindable(),
		avatar_url = $bindable(),
		full_name = $bindable(),
		sentEmailVerification = $bindable(),
		sentNewPasswordRequest = $bindable(),
		user
	}: {
		editingProfile: boolean;
		avatar_url: string;
		full_name: string;
		sentEmailVerification: boolean;
		sentNewPasswordRequest: boolean;
		user: User;
	} = $props();

	let resetPasswordForm: HTMLFormElement;

	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);

	let temp_avatar_url = $state(avatar_url);
	let inputConfigs: InputConfig[] = $state([
		{
			name: 'full_name',
			label: 'Name',
			type: 'text',
			value: full_name,
			required: true,
			placeholder: 'Name',
			disabled: false,
			error: ''
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			value: user.email as string,
			required: true,
			placeholder: 'Email',
			disabled: true,
			error: '',
			oAuthOnly: !hasEmailAuthentication
		}
	]);

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let updateProfileForm: HTMLFormElement;

	// send reset password request
	let prMessage = $state('');
	let prSuccess = $state(false);
	let prError = $state(false);
	let prSending = $state(false);
</script>

<form
	action="?/updateProfile"
	class="default-styling"
	method="post"
	bind:this={updateProfileForm}
	use:enhance={() => {
		loading = true;
		success = false;
		error = false;
		inputConfigs.forEach((config) => {
			config.error = '';
		});

		return async ({ result }) => {
			if (result.type === 'success') {
				success = true;
				error = false;

				invalidate('supabase:auth');

				// update values
				if (result.data?.updatedValues) {
					const updatedValues = result?.data?.updatedValues as {
						newEmail?: string;
						newFullName?: string;
						newAvatarUrl?: string;
					};

					if (updatedValues.newAvatarUrl) avatar_url = updatedValues.newAvatarUrl;
					if (updatedValues.newFullName) full_name = updatedValues.newFullName;
					if (updatedValues.newEmail) sentEmailVerification = true;
				}

				setTimeout(() => {
					editingProfile = false;
					loading = false;
				}, 1000);
			} else {
				error = true;
				success = false;

				if (result.data.errors) {
					inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.errors);
				}

				setTimeout(() => {
					loading = false;
				}, 1000);
			}
		};
	}}
>
	<div class="form-control">
		<input type="hidden" name="avatar_url" bind:value={temp_avatar_url} />
		<AvatarWidget bind:temp_avatar_url />
	</div>

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
			<button
				class="btn"
				type="button"
				onclick={() => resetPasswordForm.requestSubmit()}
				disabled={prSending}
			>
				{#if prSending}
					<LoadingSpinner
						bind:loading={prSending}
						bind:error={prError}
						bind:success={prSuccess}
						dim={44}
					/>
				{:else}
					<span>Send Password Reset Request</span>
				{/if}
			</button>
		</div>
	{/if}

	<button class="btn" disabled={loading}>
		{#if loading}
			<LoadingSpinner bind:loading bind:error bind:success dim={44} />
		{:else}
			<span>Save</span>
		{/if}
	</button>

	<button
		type="button"
		class="btn"
		onclick={() => {
			editingProfile = false;
		}}
	>
		Cancel
	</button>
</form>

<form
	bind:this={resetPasswordForm}
	action="?/sendPasswordResetRequest"
	class="screenreader custom"
	method="post"
	use:enhance={() => {
		prSending = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				prSuccess = true;
				prError = false;

				sentNewPasswordRequest = true;

				setTimeout(() => {
					prSending = false;
					editingProfile = false;
				}, 1000);
			} else {
				prSuccess = false;
				prError = true;

				setTimeout(() => {
					prSending = false;
				}, 1000);
			}
		};
	}}
>
	<input type="hidden" name="" />
</form>
