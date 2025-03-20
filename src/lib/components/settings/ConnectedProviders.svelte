<script lang="ts">
	import { enhance } from '$app/forms';
	import { appAvailableProviders } from '$lib/auth-controller';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import type { User } from '@supabase/supabase-js';
	let { user }: { user: User } = $props();
	let unlinkingFromProvider = $state(false);
	let linkingToProvider = $state(false);
</script>

<table>
	<tbody>
		{#each appAvailableProviders as { name }}
			<tr>
				<td>{name}</td>
				<td>
					<span>
						{user.identities?.some((i) => i.provider === name.toLowerCase())
							? 'Connected'
							: 'Not Connected'}
					</span>
					{#if !user.identities?.some((i) => i.provider === name.toLowerCase())}
						<form
							class="custom inline"
							action="?/linkProvider"
							method="post"
							use:enhance={() => {
								linkingToProvider = true;
								return async ({ result }) => {
									if (result.type === 'success' && result?.data?.redirectTo) {
										window.location = result.data.redirectTo;
									}
								};
							}}
						>
							<input type="hidden" name="provider" value={name.toLowerCase()} />
							<button class="btn" disabled={linkingToProvider}>
								{#if linkingToProvider}
									<LoadingSpinner dim={44} />
								{:else}
									<span>Link</span>
								{/if}
							</button>
						</form>
					{:else}
						<form
							class="custom inline"
							action="?/unlinkProvider"
							method="post"
							use:enhance={() => {
								unlinkingFromProvider = true;
								return async ({ result }) => {
									if (result.type === 'success' && result?.data?.redirectTo) {
										window.location = result.data.redirectTo;
									}
								};
							}}
						>
							<input type="hidden" name="provider" value={name.toLowerCase()} />
							<button class="btn" disabled={unlinkingFromProvider}>
								{#if unlinkingFromProvider}
									<LoadingSpinner dim={44} />
								{:else}
									<span>Unlink</span>
								{/if}
							</button>
						</form>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
