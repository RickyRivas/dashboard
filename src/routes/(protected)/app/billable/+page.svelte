<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import { fly } from 'svelte/transition';
	import type { PageProps } from '../$types';
	import { timeEntryFormConfig } from '$lib/form-configs/app/time-entry';
	import Form from '$lib/components/form/Form.svelte';

	const { data }: PageProps = $props();
	const timeEntries = $state(data.timeEntries);

	let timeEntryConfig = $state(timeEntryFormConfig);
	const timeEntryFormHandler = handleTriggerUpdate(timeEntryConfig);

	function onSuccess(result) {
		if (result) {
			const newTimeEntry = result.data.newTimeEntry;
			timeEntries.push(newTimeEntry);
		}
	}

	let estimatedTotal = $state(0);
	if (timeEntries.length) {
		estimatedTotal = timeEntries.reduce(
			(total: number, timeEntry: any) =>
				total + (timeEntry.status === 'Pending' ? timeEntry.billable_amount : 0),
			0
		);
	}
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading="Timesheet - Estimated Payout: ${estimatedTotal}">
				<div class="timesheet">
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
											class="status-form"
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
				</div>
			</Card>

			<Form
				name="time entry form"
				config={timeEntryConfig}
				triggerUpdate={timeEntryFormHandler}
				{onSuccess}
			/>
		</CardGroup>
	</div>
</section>
