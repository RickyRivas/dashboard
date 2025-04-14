<script lang="ts">
	import { enhance } from '$app/forms';
	import AppNotes from '$lib/app-components/AppNotes.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let checklist = $state(data.checklist);

	// checklist
	let checklistFormLoading = $state(false);
	let checklistFormError = $state(false);
	let checklistFormSuccess = $state(false);
</script>

<section>
	<div class="container">
		<h1>App</h1>
		<CardGroup>
			<Card heading="Notes">
				<AppNotes />
			</Card>

			<Card heading="Checklist">
				{#key checklist}
					<ul id="checklist">
						{#each checklist as item (item.id)}
							<li
								id="checklist-item-{item.id}"
								data-status={item.status}
								transition:fly={{ x: 100 }}
							>
								<h3>{item.title}</h3>
								{#if item.description}
									<p>{item.description}</p>
								{/if}
								<form
									class="checklist-delete-form"
									action="?/deleteItem"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												const removedItemid = +result.data.removedItemid;
												const index = checklist.findIndex((item) => item.id === removedItemid);
												checklist.splice(index, 1);
											}
										};
									}}
								>
									<input type="hidden" name="id" value={item.id} />
									<button class="btn error">Delete</button>
								</form>
								<form
									action="?/updateStatus"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												const parent = document.querySelector(
													`ul#checklist li#checklist-item-${item.id}`
												);
												parent.setAttribute('data-status', result.data.newStatus);
											}
										};
									}}
								>
									<input type="hidden" name="item-id" value={item.id} />
									<div class="form-control">
										<select
											name="status"
											value={item.status}
											onchange={(e) => {
												e.target.parentElement.parentElement.requestSubmit();
											}}
										>
											<option value="">Please select an option</option>
											{#each ['pending', 'in_progress', 'completed', 'blocked', 'deferred', 'canceled'] as status}
												<option value={status}>{status}</option>
											{/each}
										</select>
									</div>
								</form>
							</li>
						{:else}
							<p>No items.</p>
						{/each}
					</ul>
				{/key}

				<form
					action="?/resetAllToPending"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								checklist = checklist.map((item) => ({
									...item,
									status: 'pending'
								}));
							}
						};
					}}
				>
					<button class="btn">Reset Status'</button>
				</form>
			</Card>

			<Card heading="Add new item">
				<form
					id="checklist-form"
					class="default-styling"
					action="?/addItem"
					method="post"
					use:enhance={() => {
						checklistFormLoading = true;
						checklistFormSuccess = false;
						checklistFormError = false;
						return async ({ result, update }) => {
							if (result.type === 'success') {
								checklistFormSuccess = true;
								checklistFormError = false;

								const newItem = result.data.newItem;
								checklist.push(newItem);

								setTimeout(() => {
									checklistFormLoading = false;
									update({ reset: true });
								}, 1000);
							} else {
								checklistFormError = true;
								checklistFormSuccess = false;

								setTimeout(() => {
									checklistFormLoading = false;
								}, 1000);
							}
						};
					}}
				>
					<div class="form-control">
						<label>
							Title
							<input type="text" name="title" required />
						</label>
					</div>
					<div class="form-control">
						<label>
							Description
							<input type="text" name="description" required />
						</label>
					</div>

					<button class="btn" disabled={checklistFormLoading}>
						{#if checklistFormLoading}
							<LoadingSpinner
								bind:loading={checklistFormLoading}
								bind:error={checklistFormError}
								bind:success={checklistFormSuccess}
								dim={44}
							/>
						{:else}
							Add new item
						{/if}
					</button>
				</form>
			</Card>
		</CardGroup>
	</div>
</section>
