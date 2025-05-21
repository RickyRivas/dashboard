<script lang="ts">
	import { enhance } from '$app/forms';
	import { createFormHandler, type InputConfig } from '$lib/form-helpers';
	import type { SiteProcessChecklist } from '$lib/types';
	import ErrorMessage from '../form/ErrorMessage.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let errorMessage = $state('');

	let { site_checklist }: { site_checklist: SiteProcessChecklist } = $props();

	let checklistItems = $state([
		{
			name: 'opportunity',
			label: 'Opportunity',
			dbCol: 'opportunity_status',
			value: ''
		},
		{
			name: 'contract_signing',
			label: 'Contract Signing',
			dbCol: 'contract_signing_status',
			value: ''
		},
		{
			name: 'questionnaire',
			label: 'Questionnaire',
			dbCol: 'questionnaire_status',
			value: ''
		},
		{
			name: 'payment',
			label: 'Payment',
			dbCol: 'payment_status',
			value: ''
		},
		{
			name: 'design_consultation',
			label: 'Design Consultation',
			dbCol: 'design_consultation_status',
			value: ''
		},
		{
			name: 'design_reveal',
			label: 'Design Reveal',
			dbCol: 'design_reveal_status',
			value: ''
		},
		{
			name: 'design_approval',
			label: 'Design Approval',
			dbCol: 'design_approval_status',
			value: ''
		},
		{
			name: 'design_to_code',
			label: 'Design To Code',
			dbCol: 'design_to_code_status',
			value: ''
		},
		{
			name: 'design_qa',
			label: 'Design QA',
			dbCol: 'design_qa_status',
			value: ''
		},
		{
			name: 'favicon',
			label: 'Favicon',
			dbCol: 'favicon_status',
			value: ''
		},
		{
			name: 'sitemap',
			label: 'Sitemap',
			dbCol: 'sitemap_status',
			value: ''
		},
		{
			name: 'meta_tags',
			label: 'Meta tags, title tag, and OG images',
			dbCol: 'meta_tags_status',
			value: ''
		},
		{
			name: 'google_analytics',
			label: 'Google Analytics',
			dbCol: 'google_analytics_status',
			value: ''
		},
		{
			name: 'connect_domain',
			label: 'Connect Domain',
			dbCol: 'connect_domain_status',
			value: ''
		},
		{
			name: 'copywriting',
			label: 'Copywriting',
			dbCol: 'copywriting_status',
			value: ''
		},
		{
			name: 'proofreading',
			label: 'Proofreading',
			dbCol: 'proofreading_status',
			value: ''
		},
		{
			name: 'submit_google_console',
			label: 'Submit Website to Google Console',
			dbCol: 'submit_google_console_status',
			value: ''
		},
		{
			name: 'technical_qa',
			label: 'Technical QA',
			dbCol: 'technical_qa_status',
			value: ''
		},
		{
			name: 'launch',
			label: 'Launch',
			dbCol: 'launch_status',
			value: ''
		},
		{
			name: 'final_payment',
			label: 'Final Payment',
			dbCol: 'final_payment_status',
			value: ''
		}
	]);

	const statusOptions = ['not_started', 'in_progress', 'completed', 'blocked', 'not_applicable'];

	// prefill
	if (site_checklist) {
		for (const [key, value] of Object.entries(site_checklist)) {
			const item = checklistItems.find((i) => i.dbCol === key);
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
							name={item.dbCol}
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
