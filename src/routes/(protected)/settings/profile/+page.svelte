<script lang="ts">
	// layout
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
	import ConnectedProviders from '$lib/components/settings/ConnectedProviders.svelte';
	import AccountDeletionForm from '$lib/components/settings/AccountDeletionForm.svelte';

	// components

	// helpers
	import { type InputConfig } from '$lib/form-helpers';
	import { profileSettingsInputConfigs } from '$lib/form-configs';

	// svelte imports
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { avatarPlaceholderPath } from '$lib/auth-controller';

	// supabase
	import type { User } from '@supabase/supabase-js';
	import UpdateProfileForm from '$lib/components/settings/UpdateProfileForm.svelte';
	import SettingsCard from '$lib/components/settings/SettingsCard.svelte';
	import SettingsCardGroup from '$lib/components/settings/SettingsCardGroup.svelte';

	let editingProfile = $state(false);
	let { data }: { data: PageData } = $props();
	let { user }: { user: User } = data;

	// providers
	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);

	// profile form
	let inputConfigs: InputConfig[] = $state(profileSettingsInputConfigs);

	inputConfigs[0].value = page.data.profile.full_name;
	inputConfigs[1].value = user.email as string;
	inputConfigs[1].oAuthOnly = !hasEmailAuthentication;

	let avatar_url = $state(page.data.profile.avatar_url);

	$effect(() => {
		// clear errors when we toggle off editing
		if (!editingProfile) inputConfigs.forEach((config) => (config.error = ''));
		avatar_url = page.data.profile.avatar_url;
	});
</script>

<SettingsLayout>
	<h1>All Settings</h1>
	<SettingsCardGroup>
		<SettingsCard heading="Personal Information">
			{#if editingProfile}
				<UpdateProfileForm {user} {avatar_url} {data} bind:editing={editingProfile} />
			{:else}
				<table>
					<tbody>
						<tr>
							<td>Avatar:</td>
							<td>
								<div class="small-avatar">
									<img
										src={page.data.profile.avatar_url || avatarPlaceholderPath}
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
				<button
					class="btn"
					onclick={() => {
						editingProfile = true;
					}}
				>
					Edit Profile
				</button>
			{/if}
		</SettingsCard>

		<SettingsCard heading="Connected accounts:">
			<ConnectedProviders {user} />
		</SettingsCard>

		<SettingsCard heading="Danger">
			<AccountDeletionForm />
		</SettingsCard>
	</SettingsCardGroup>
</SettingsLayout>
