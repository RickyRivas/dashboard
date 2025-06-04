<script lang="ts">
	// components
	import Form from '$lib/components/form/Form.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';

	// svelte
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	// helpers & libs
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import moment from 'moment';

	// configs
	import { sendResetFormConfig } from '$lib/form-configs/settings/send-reset';
	import { updateProfileFormConfig } from '$lib/form-configs/settings/profile';
	import { deleteAccountFormConfig } from '$lib/form-configs/settings/account-deletion';
	import { appAvailableProviders } from '$lib/auth-controller.svelte';

	let editingProfile = $state(false);
	const toggleEditMode = () => (editingProfile = !editingProfile);
	let { data }: { data: PageData } = $props();
	let { user } = data;

	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);

	// new forms
	// 1. update profile form
	let updateProfileConfig = $state(updateProfileFormConfig);
	const updateProfileFormHandler = handleTriggerUpdate(updateProfileConfig);
	updateConfigWithValues(updateProfileConfig, {
		email: user?.user_metadata.email || '',
		avatar_url: page.data.profile.avatar_url || '',
		full_name: page.data.profile.full_name || ''
	});
	function updateProfileOnSuccess(result, form) {
		invalidate('supabase:auth');

		if (result.data?.updatedValues) {
			console.log(result.data?.updatedValues);
		}

		editingProfile = false;
	}

	// 2. password reset form
	let passwordResetConfig = $state(sendResetFormConfig);
	const passwordResetFormHandler = handleTriggerUpdate(passwordResetConfig);
	updateConfigWithValues(passwordResetConfig, { userid: user?.id || '' });
	let sentRequest = $state(false);
	function passwordResetOnSuccess(result, form) {
		sentRequest = true;
		editingProfile = false;
	}

	// 3. account deletion
	let deleteConfig = $state(deleteAccountFormConfig);
	const deleteFormHandler = handleTriggerUpdate(deleteConfig);
</script>

<section>
	<div class="container">
		<h1>Profile Settings</h1>

		<CardGroup>
			<Card heading="Personal Information">
				{#if editingProfile}
					<Form
						name="update profile form"
						classes={['default-styling', 'child-form']}
						config={updateProfileConfig}
						triggerUpdate={updateProfileFormHandler}
						onSuccess={updateProfileOnSuccess}
					/>
					<Form
						name="send password reset request"
						classes={['']}
						config={passwordResetConfig}
						triggerUpdate={passwordResetFormHandler}
						onSuccess={passwordResetOnSuccess}
					/>
				{:else}
					<p>Email: {user?.user_metadata.email}</p>
					<p>avatar_url: {page.data.profile.avatar_url}</p>
					<p>full_name: {page.data.profile.full_name}</p>
					{#if hasEmailAuthentication}
						<p>Password: ***</p>
					{/if}
					<p></p>
					<p>last login: {moment(data.user?.last_sign_in_at).format('MMMM D, YYYY [at] h:mm A')}</p>
					{#if sentRequest}
						<p>A password request has been sent to your email.</p>
					{/if}
				{/if}

				<button class="btn" onclick={toggleEditMode}>
					{editingProfile ? 'Cancel edit mode' : 'Edit Profile'}
				</button>
			</Card>

			<Card heading="Connected accounts">
				{#each appAvailableProviders as provider}
					{#if user?.identities?.find((i) => i.provider === provider.name.toLowerCase())}
						<Form
							name="unlink from {provider} form"
							config={provider.unlinkConfig}
							triggerUpdate={provider.unlinkFormHander}
							classes={['']}
						/>
					{:else}
						<Form
							name="link from {provider} form"
							config={provider.linkConfig}
							triggerUpdate={provider.linkFormHander}
							classes={['']}
						/>
					{/if}
				{/each}
			</Card>

			<Card heading="Danger">
				<Form
					name="delete account form"
					classes={['default-styling', 'child-form']}
					config={deleteConfig}
					triggerUpdate={deleteFormHandler}
				/>
			</Card>
		</CardGroup>
	</div>
</section>
