<script lang="ts">
	import { avatarPlaceholderPath } from '$lib/auth-controller';
	import type { User } from '@supabase/supabase-js';
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

	const hasEmailAuthentication = user?.identities?.some(
		(provider) => provider.provider === 'email'
	);
</script>

<table>
	<tbody>
		<tr>
			<td>Avatar:</td>
			<td>
				<div class="small-avatar">
					<img
						src={avatar_url || avatarPlaceholderPath}
						alt={full_name || 'placeholder'}
						width="40"
						height="40"
						decoding="async"
					/>
				</div>
			</td>
		</tr>
		<tr>
			<td>Name:</td>
			<td>{full_name}</td>
		</tr>
		<tr>
			<td>Email:</td>
			<td>{user.email} {sentEmailVerification ? '(Please verify new email)' : ''}</td>
		</tr>
		{#if hasEmailAuthentication}
			<tr>
				<td>Password:</td>
				<td>*** {sentNewPasswordRequest ? '(password reset request sent to your email)' : ''}</td>
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
