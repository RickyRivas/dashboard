<script lang="ts">
	import { enhance } from '$app/forms';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { fly } from 'svelte/transition';
	let { checklist } = $props();

	// checklist
	let checklistFormLoading = $state(false);
	let checklistFormError = $state(false);
	let checklistFormSuccess = $state(false);
</script>

<h2>Checklist</h2>
{#key checklist}
	<ul id="checklist">
		{#each checklist as item (item.id)}
			<li id="checklist-item-{item.id}" class:checked={item.checked} transition:fly={{ x: 100 }}>
				<form
					class="update-status-form"
					action="?/updateStatus"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								const parent = document.querySelector(`ul#checklist li#checklist-item-${item.id}`);
								parent.setAttribute('data-status', result.data.checked);
							}
						};
					}}
				>
					<input type="hidden" name="item-id" value={item.id} />
					<input
						type="checkbox"
						name="checked"
						id="checklist-item-{item.id}-checkbox"
						bind:checked={item.checked}
						onchange={(e) => {
							e.target.parentElement.requestSubmit();
						}}
					/>
					<label for="checklist-item-{item.id}-checkbox">
						<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
							<path d="M2 12.5L8.5625 20L23 5" stroke="currentcolor" />
						</svg>
					</label>
				</form>
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
					<button aria-label="delete checklist item"> Delete </button>
				</form>
				<h3>{item.title}</h3>
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
					checked: false
				}));
			}
		};
	}}
>
	<button class="btn">Reset Checklist</button>
</form>
<h2>Add checklist item</h2>
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
