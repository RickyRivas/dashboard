<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { LayoutProps } from './$types';
	import './styles.less';
	import PageLoader from '$lib/PageLoader.svelte';
	import { navigating } from '$app/state';
	const { children, data }: LayoutProps = $props();
	const { supabase, session } = data;

	onMount(() => {
		// Set up auth state listener
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			// Check if session has changed by comparing expiry times
			if (newSession?.expires_at !== session?.expires_at) {
				// If changed, invalidate the auth data (reload data)
				invalidate('supabase:auth');
			}
		});

		// Cleanup: unsubscribe when component unmounts
		return () => data.subscription.unsubscribe();
	});
</script>

<!-- theme -->
<svelte:head>
	<script>
		{
			const theme = localStorage.getItem('sv:theme');

			document.documentElement.classList.add(
				!theme || theme === 'system'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light'
					: theme
			);
		}
	</script>
</svelte:head>

{#if navigating.to}
	<PageLoader />
{:else}
	{@render children()}
{/if}
