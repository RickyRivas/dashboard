<script lang="ts">
	import NotesWidget from '$lib/widgets/NotesWidget.svelte';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import ChecklistWidget from '$lib/widgets/ChecklistWidget.svelte';
	import SlideshowWidget from '$lib/widgets/SlideshowWidget.svelte';
	import FormGroup from '$lib/components/auto-form/AutoFormGroup.svelte';
	import { autoFormConfig } from '$lib/auto-form-configs/example';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	const { data }: PageProps = $props();
	let checklist = $state(data.checklist);

	let autoConfig = $state(autoFormConfig);
	let autoConfigFormHandler = handleTriggerUpdate(autoConfig);
</script>

<section>
	<div class="container">
		<h2>auto group</h2>
		<FormGroup name="auto form" config={autoConfig} triggerUpdate={autoConfigFormHandler} />
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
