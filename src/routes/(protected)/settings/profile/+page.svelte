<script lang="ts">
	// components
	import Form from '$lib/components/form/Form.svelte';
	import DisplayForm from '$lib/components/display-form/DisplayForm.svelte';
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
	import type { FieldDefinition } from '$lib/form-types';

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
	function updateProfileOnSuccess(result) {
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
	function passwordResetOnSuccess(result) {
		sentRequest = true;
		editingProfile = false;
	}

	// 3. account deletion
	let deleteConfig = $state(deleteAccountFormConfig);
	const deleteFormHandler = handleTriggerUpdate(deleteConfig);

	// 4. display form. add a few fields that wont be updated by user
	const extraFields: FieldDefinition[] = [
		{
			configuration: {
				inputAttributes: {
					name: 'last-sign-in',
					type: 'text',
					value: moment(data.user?.last_sign_in_at).format('MMMM D, YYYY h:mm A'),
					disabled: false
				},
				labelConfig: {
					text: 'Last Sign In'
				}
			},
			fieldState: { hasError: false, showSuccess: false, statusMessage: '' }
		},
		{
			configuration: {
				inputAttributes: {
					name: 'created-at',
					type: 'text',
					value: moment(data.user?.created_at).format('MMMM D, YYYY h:mm A'),
					disabled: false
				},
				labelConfig: {
					text: 'Created At'
				}
			},
			fieldState: { hasError: false, showSuccess: false, statusMessage: '' }
		},
		{
			configuration: {
				inputAttributes: {
					name: 'updated-at',
					type: 'text',
					value: moment(data.user?.updated_at).format('MMMM D, YYYY h:mm A'),
					disabled: false
				},
				labelConfig: {
					text: 'Profile Last Updated'
				}
			},
			fieldState: { hasError: false, showSuccess: false, statusMessage: '' }
		}
	];

	const passwordField: FieldDefinition = $state({
		configuration: {
			inputAttributes: {
				name: 'password',
				type: 'text',
				value: hasEmailAuthentication ? '***' : 'No password set.',
				disabled: false
			},
			labelConfig: {
				text: 'Password'
			}
		},
		fieldState: { hasError: false, showSuccess: false, statusMessage: '' }
	});
	extraFields.push(passwordField);

	// reactive reset pw success ui
	$effect(() => {
		if (sentRequest)
			passwordField.configuration.inputAttributes.value =
				'A password request has been sent to your email.';
	});
</script>

<section>
	<div class="container">
		<h1>Profile Settings</h1>

		<CardGroup>
			<Card heading="Personal Information">
				{#if editingProfile}
					<Form
						name="update profile form"
						classes={['default-styling', 'child-form', 'margin-bottom-1em']}
						config={updateProfileConfig}
						triggerUpdate={updateProfileFormHandler}
						onSuccess={updateProfileOnSuccess}
					/>
					{#if hasEmailAuthentication}
						<Form
							name="send password reset request"
							classes={['']}
							config={passwordResetConfig}
							triggerUpdate={passwordResetFormHandler}
							onSuccess={passwordResetOnSuccess}
						/>
					{/if}
				{:else}
					<!-- display purposes, can add extra non-editable fields -->
					<DisplayForm
						classes={['display-form', 'child-form']}
						name="display user data"
						{extraFields}
						config={updateProfileConfig}
					/>
				{/if}

				<button class="btn" style:margin-top="1em" onclick={toggleEditMode}>
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
