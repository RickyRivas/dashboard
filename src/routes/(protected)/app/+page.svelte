<script lang="ts">
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';
	import SlideshowWidget from '$lib/widgets/SlideshowWidget.svelte';
	const { data }: PageProps = $props();
	let checklist = $state(data.checklist);
	import Form from '$lib/components/form/Form.svelte';
	import { testFormConfig } from '$lib/forms/test';
	import { handleTriggerUpdate } from '$lib/form-helpers';

	// input testing
	let configOne = $state(testFormConfig);
	const triggerUpdateHandlerOne = handleTriggerUpdate(configOne);
	$inspect('p 1', configOne);
</script>

<section>
	<div class="container">
		<h2>form 2.0 testing</h2>
		<Form name="form config 1" config={configOne} triggerUpdate={triggerUpdateHandlerOne} />
	</div>
</section>

<section>
	<div class="container">
		{#if page.data.profile.full_name}
			<h1>Welcome back, {page.data.profile.full_name}</h1>
		{:else}
			<h1>App</h1>
		{/if}

		<div class="widget-grid">
			<div class="widget-grid__item">
				<NotesWidget />
			</div>
			<div class="widget-grid__item" style:padding="0">
				<SlideshowWidget />
			</div>
			<div class="widget-grid__item">
				<!-- <ChecklistWidget {checklist} /> -->
			</div>
		</div>
	</div>
</section>
