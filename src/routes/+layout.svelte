<script lang="ts">
	// global layout and styles
	import { onMount, type Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';
	import './styles.less';
	type prop = {
		children: Snippet;
	};

	const { children, data }: prop = $props();
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

{@render children()}
