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
	let updateProfileForm: HTMLFormElement;

	// send reset password request
	let passwordRequestMessage = $state('');
	let sendingPasswordRequest = $state(false);
</script>

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
			<button class="btn" type="button" onclick={() => resetPasswordForm.requestSubmit()}>
				{#if sendingPasswordRequest}
					<LoadingSpinner dim={44} />
				{:else}
					<span>Send Password Reset Request</span>
				{/if}
			</button>
			{#if passwordRequestMessage}
				<span>{passwordRequestMessage}</span>
			{/if}
		</div>
	{/if}

	<button class="btn" disabled={loading}>
		{#if loading}
			<LoadingSpinner dim={44} />
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
		sendingPasswordRequest = true;
		return async ({ result }) => {
			sendingPasswordRequest = false;
			if (result.status === 200) passwordRequestMessage = 'Please check your email.';
			else passwordRequestMessage = 'Something went wrong.';
			setTimeout(() => {
				editing = false;
			}, 3000);
		};
	}}
>
	<input type="hidden" name="" />
</form>
