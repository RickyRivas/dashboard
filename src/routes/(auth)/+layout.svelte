<script lang="ts">
	import type { LayoutProps } from './$types';
	const { children }: LayoutProps = $props();
</script>

<main>
	<section id="auth-hero">
		<div class="auth-content">
			{@render children()}
		</div>
	</section>
</main>
