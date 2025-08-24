<script lang="ts">
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';
	import SlideshowWidget from '$lib/widgets/SlideshowWidget.svelte';
	const { data }: PageProps = $props();
	let checklist = $state(data.checklist);
</script>

<section>
	<div class="container">
		{#if page.data.profile.full_name}
			<h1>Welcome back, {page.data.profile.full_name}</h1>
		{:else}
			<h1>App</h1>
		{/if}

		<div class="widget-grid">
			<div class="widget-grid__item" style:padding="0">
				<SlideshowWidget />
			</div>
			<div class="widget-grid__item">
				<ChecklistWidget {checklist} />
			</div>
		</div>
	</div>
</section>
