<script lang="ts">
	import { enhance } from '$app/forms';
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';

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
			<div class="widget-grid__item">
				<h2>Slideshow</h2>
			</div>

			<div class="widget-grid__item">
				<NotesWidget />
			</div>

			<div class="widget-grid__item">
				<ChecklistWidget {checklist} />
			</div>
		</div>
	</div>
</section>
