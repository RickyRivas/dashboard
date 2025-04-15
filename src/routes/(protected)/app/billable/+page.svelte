<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import { fly } from 'svelte/transition';
	import type { PageProps } from '../$types';

	const { data }: PageProps = $props();
	const timeEntries = $state(data.timeEntries);

	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);

	interface TimeEntry {
		id: string;
		user_id: string;
		project_name: string;
		date: string;
		start_time: string;
		end_time: string;
		hours_spent: string;
		task_description: string | null;
		task_category: string;
		billable_status: boolean;
		hourly_rate: number;
		billable_amount: number;
		client_contact: string | null;
		notes: string | null;
		invoice_number: string | null;
		status: string;
		tags: string[];
		created_at: string;
		updated_at: string;
	}

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'projectName',
			label: 'Project Name',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Enter project or account name',
			disabled: false,
			error: ''
		},
		{
			name: 'date',
			label: 'Date',
			type: 'date',
			value: '',
			required: true,
			placeholder: 'Select date',
			disabled: false,
			error: ''
		},
		{
			name: 'startTime',
			label: 'Start Time',
			type: 'time',
			value: '',
			required: true,
			placeholder: 'Start time',
			disabled: false,
			error: ''
		},
		{
			name: 'endTime',
			label: 'End Time',
			type: 'time',
			value: '',
			required: true,
			placeholder: 'End time',
			disabled: false,
			error: ''
		},
		{
			name: 'hoursSpent',
			label: 'Hours Spent',
			type: 'number',
			value: '',
			required: true,
			placeholder: 'Total hours',
			disabled: false,
			error: '',
			step: '.01'
		},
		{
			name: 'taskDescription',
			label: 'Task Description',
			type: 'textarea',
			value: '',
			required: false,
			placeholder: 'Describe what you worked on',
			disabled: false,
			error: ''
		},
		{
			name: 'taskCategory',
			label: 'Task Category',
			type: 'select',
			options: ['Development', 'Design', 'Meetings', 'Planning', 'Research', 'QA/Testing', 'Other'],
			value: '',
			required: true,
			placeholder: 'Select category',
			disabled: false,
			error: ''
		},
		{
			name: 'billableStatus',
			label: 'Billable',
			type: 'checkbox',
			value: true,
			required: false,
			placeholder: '',
			disabled: false,
			error: ''
		},
		{
			name: 'hourlyRate',
			label: 'Hourly Rate',
			type: 'number',
			value: '',
			required: true,
			placeholder: 'Rate in $',
			disabled: false,
			error: ''
		},
		{
			name: 'clientContact',
			label: 'Client Contact',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Person who requested the work',
			disabled: false,
			error: ''
		},
		{
			name: 'notes',
			label: 'Notes',
			type: 'textarea',
			value: '',
			required: false,
			placeholder: 'Additional context or details',
			disabled: false,
			error: ''
		},
		{
			name: 'status',
			label: 'Status',
			type: 'select',
			options: ['Pending', 'Approved', 'Billed', 'Paid'],
			value: 'Pending',
			required: true,
			placeholder: 'Select status',
			disabled: false,
			error: ''
		},
		{
			name: 'tags',
			label: 'Tags',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Comma-separated tags',
			disabled: false,
			error: ''
		}
	]);
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading="Timesheet">
				<table>
					<thead>
						<tr>
							<th>Project</th>
							<th>Customer</th>
							<th>Date</th>
							<th>Task</th>
							<th>Status</th>
							<th>Time Spent</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each timeEntries as entry (entry.id)}
							<tr transition:fly={{ x: 100 }}>
								<td>{entry.project_name}</td>
								<td>{entry.client_contact}</td>
								<td>{entry.date}</td>
								<td>{entry.task_category}</td>
								<td>
									<form
										id="status-form-{entry.id}"
										action="?/updateStatus"
										method="post"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													document
														.querySelector(`#status-form-${entry.id} select`)
														.setAttribute('data-status', result.data.newStatus.toLowerCase());
												}
											};
										}}
									>
										<div class="form-control">
											<input type="hidden" name="entry-id" value={entry.id} />
											<select
												name="status"
												data-status={entry.status.toLowerCase()}
												value={entry.status}
												onchange={(e) => {
													e.target.parentElement.parentElement.requestSubmit();
												}}
											>
												{#each ['Pending', 'Approved', 'Billed', 'Paid'] as option}
													<option value={option}>{option}</option>
												{/each}
											</select>
										</div>
									</form>
								</td>
								<td>{entry.hours_spent}</td>
								<td>
									<form
										action="?/deleteTimeEntry"
										method="post"
										use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													const removedEntryId = result.data.removedEntryId;
													const index = timeEntries.findIndex(
														(entry) => entry.id === removedEntryId
													);
													timeEntries.splice(index, 1);
												}
											};
										}}
									>
										<input type="hidden" name="id" value={entry.id} />
										<button class="btn error">Delete</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</Card>

			<form
				class="default-styling"
				action="?/addTimeEntry"
				method="post"
				use:enhance={() => {
					loading = true;
					success = false;
					error = false;

					return async ({ result, update }) => {
						if (result.type === 'success') {
							success = true;
							error = false;

							const newTimeEntry = result.data.newTimeEntry;
							timeEntries.push(newTimeEntry);

							setTimeout(() => {
								loading = false;
								update({ reset: true });
							}, 1000);
						} else {
							error = true;
							success = false;

							setTimeout(() => {
								loading = false;
							}, 1000);
						}
					};
				}}
			>
				{#each inputConfigs as { name, label, placeholder, required, disabled, type, oAuthOnly, options, step }, i}
					<FormInput
						id={name}
						{name}
						{label}
						{placeholder}
						{required}
						{type}
						{options}
						{step}
						bind:value={inputConfigs[i].value}
						bind:disabled={loading}
						bind:error={inputConfigs[i].error}
						autocomplete="off"
					/>
				{/each}
				<button class="btn error" disabled={loading}>
					{#if loading}
						<LoadingSpinner bind:loading bind:error bind:success dim={44} />
					{:else}
						<span>Add</span>
					{/if}
				</button>
			</form>
		</CardGroup>
	</div>
</section>

<style lang="less">
	table {
		text-align: left;
	}
</style>
