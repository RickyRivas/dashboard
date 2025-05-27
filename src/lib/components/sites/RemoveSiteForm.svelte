<script lang="ts">
	import { enhance } from '$app/forms';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let { site, removeSite } = $props();

	// form ui state
	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
</script>

<form
	action="?/removeSite"
	method="post"
	use:enhance={({ cancel }) => {
		// move on to deletion
		loading = true;
		success = false;
		error = false;

		// confrim
		const confirm = prompt('Are you sure?');
		if (confirm === null) {
			loading = false;
			success = false;
			error = false;
			cancel();
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				success = true;
				error = false;

				// passed down function
				const removedItemid = result?.data?.removedItemid;
				removeSite(removedItemid);

				setTimeout(() => {
					loading = false;
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
	<input type="hidden" name="id" value={site.id} />
	<button class="btn" disabled={loading}>
		{#if loading}
			<LoadingSpinner bind:loading bind:error bind:success dim={44} />
		{:else}
			Remove
		{/if}
	</button>
</form>
