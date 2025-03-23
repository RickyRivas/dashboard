<script lang="ts">
	// components
	import ConnectedProviders from '$lib/components/settings/ConnectedProviders.svelte';
	import AccountDeletionForm from '$lib/components/settings/AccountDeletionForm.svelte';
	import UpdateProfileForm from '$lib/components/settings/UpdateProfileForm.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import ProfileInfo from '$lib/components/settings/ProfileInfo.svelte';

	// svelte imports
	import { page } from '$app/state';
	import type { PageData } from './$types';

	// supabase
	import type { User } from '@supabase/supabase-js';

	let editingProfile = $state(false);
	let { data }: { data: PageData } = $props();
	let { user }: { user: User } = data;

	// profile form
	let avatar_url = $state(page.data.profile.avatar_url);
	let full_name = $state(page.data.profile.full_name);
	let sentEmailVerification = $state(false);
	let sentNewPasswordRequest = $state(false);
</script>

<section class="default-styling">
	<h1>Profile Settings</h1>
	<CardGroup>
		<Card heading="Personal Information">
			{#if editingProfile}
				<UpdateProfileForm
					{user}
					bind:avatar_url
					bind:full_name
					bind:editingProfile
					bind:sentEmailVerification
					bind:sentNewPasswordRequest
				/>
			{:else}
				<ProfileInfo
					{user}
					bind:avatar_url
					bind:full_name
					bind:editingProfile
					bind:sentEmailVerification
					bind:sentNewPasswordRequest
				/>
			{/if}
		</Card>

		<Card heading="Connected accounts">
			<ConnectedProviders {user} />
		</Card>

		<Card heading="Danger">
			<AccountDeletionForm />
		</Card>
	</CardGroup>
</section>
