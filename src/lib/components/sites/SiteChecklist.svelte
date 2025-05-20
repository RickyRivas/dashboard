<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import type { SiteProcessChecklist } from '$lib/types';
	import ErrorMessage from '../form/ErrorMessage.svelte';
	import FormInput from '../form/FormInput.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	let { site_checklist }: { site_checklist: SiteProcessChecklist } = $props();

	let checklistItems = $state([
		{
			name: 'client_questionnaires',
			label: 'New Client Questionnaires',
			dbRow: 'client_questionnaires_status',
			value: ''
		},
		{
			name: 'design_consultation',
			label: 'Design Consultation',
			dbRow: 'design_consultation_status',
			value: ''
		},
		{
			name: 'design_reveal',
			label: 'Design Reveal',
			dbRow: 'design_reveal_status',
			value: ''
		},
		{
			name: 'design_approval',
			label: 'Design Approval',
			dbRow: 'design_approval_status',
			value: ''
		},
		{
			name: 'website_build',
			label: 'Website Build',
			dbRow: 'website_build_status',
			value: ''
		},
		{
			name: 'technical_qa',
			label: 'Technical QA',
			dbRow: 'technical_qa_status',
			value: ''
		},
		{
			name: 'design_qa',
			label: 'Design QA',
			dbRow: 'design_qa_status',
			value: ''
		},
		{
			name: 'dns_seo_setup',
			label: 'Connect to DNS, SEO, Favicons, generate sitemap',
			dbRow: 'dns_seo_setup_status',
			value: ''
		},
		{
			name: 'copywriting',
			label: 'Copywriting',
			dbRow: 'copywriting_status',
			value: ''
		},
		{
			name: 'proofreading',
			label: 'Proofreading',
			dbRow: 'proofreading_status',
			value: ''
		},
		{
			name: 'launch',
			label: 'Launch',
			dbRow: 'launch_status',
			value: ''
		}
	]);

	const statusOptions = ['not_started', 'in_progress', 'completed', 'blocked', 'not_applicable'];

	// prefill
	if (site_checklist) {
		for (const [key, value] of Object.entries(site_checklist)) {
			const item = checklistItems.find((i) => i.dbRow === key);
			if (item) item.value = value;
		}
	}
</script>

<ul>
	{#each checklistItems as item}
		<li>
			<form
				action="?/updateChecklistItem"
				method="post"
				use:enhance={() => {
					return async ({ result }) => {
						console.log(result);
					};
				}}
			>
				<div class="form-control">
					<label>
						{item.label}
						<select
							name={item.dbRow}
							bind:value={item.value}
							onchange={(e) => {
								const target = e.target as HTMLSelectElement;
								const form = target.parentElement?.parentElement?.parentElement as HTMLFormElement;
								form.requestSubmit();
							}}
						>
							<option value="">Please select an option</option>
							{#each statusOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					</label>
				</div>
			</form>
		</li>
	{/each}
</ul>
