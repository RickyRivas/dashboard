<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import Navigation from '$lib/components/Navigation.svelte';
	type prop = {
		children: Snippet;
		data: LayoutData;
	};

	const { children, data }: prop = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		// Set up auth state listener
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			console.log(_);
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

<Navigation navType="protected" />
<main id="protected">
	{@render children()}
</main>
