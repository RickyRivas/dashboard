<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Navigation from '$lib/components/Navigation.svelte';
	import { getNavRoutes } from '$lib/navigation.js';

	type prop = {
		children: Snippet;
		data: LayoutData;
	};

	const { children }: prop = $props();
	const routes = getNavRoutes('public');
</script>

<Navigation navType="public" {routes} />

<main>
	<section class="default-styling">
		<div class="container">
			{@render children()}
		</div>
	</section>
</main>
