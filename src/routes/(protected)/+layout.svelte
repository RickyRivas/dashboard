<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';

	type prop = {
		children: Snippet;
		data: LayoutData;
	};

	const { children, data }: prop = $props();
	let { session, supabase } = $derived(data);
	const routes = getNavRoutes('protected');

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

<Navigation navType="protected" {routes} />
<main id="protected">
	{@render children()}
</main>
