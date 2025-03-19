<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import type { LayoutProps } from './$types';
	const { children }: LayoutProps = $props();
</script>

<main>
	<section id="auth-hero">
		<a id="logo" href="/"><Logo /></a>
		<div class="auth-content">
			{@render children()}
		</div>
		<p class="auth-content-footer">Rivas Web Designs, LLC &#169; {new Date().getFullYear()}</p>
	</section>
</main>
