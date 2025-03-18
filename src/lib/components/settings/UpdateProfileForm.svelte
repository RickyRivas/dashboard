<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { profileSettingsInputConfigs } from '$lib/form-configs';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import type { PageData } from '../../../routes/(public)/$types';
	import AvatarWidget from './AvatarWidget.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import type { User } from '@supabase/supabase-js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let {
		editing = $bindable(),
		avatar_url,
		user,
		data
	}: { editing: boolean; avatar_url: string; user: User; data: PageData } = $props();

	let resetPasswordForm: HTMLFormElement;
	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);
	let inputConfigs: InputConfig[] = $state(profileSettingsInputConfigs);
	inputConfigs[0].value = page.data.profile.full_name;
	inputConfigs[1].value = user.email as string;
	inputConfigs[1].oAuthOnly = !hasEmailAuthentication;

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
	class="custom"
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

				setTimeout(() => {
					editing = false;
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
	<input type="hidden" name="avatar_url" bind:value={avatar_url} />
	<AvatarWidget full_name={page.data.profile.full_name} bind:avatar_url />
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
			editing = false;
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

				setTimeout(() => {
					prSending = false;
					editing = false;
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
