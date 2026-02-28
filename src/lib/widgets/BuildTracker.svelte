<script lang="ts">
	// TODO:
	import { page } from '$app/state';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { buildTrackerState } from '$lib/tracker-state.svelte';
	import { onMount } from 'svelte';

	let open = $state(false);
	let trackingBuild = $state(false);
	let spec_url = $state('');
	let account = $state('');

	let trackerTable = 'build_tracker';
	let trackerTableId = '0d2e6583-7989-46d5-bb44-2a40881718fc';

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);

	let disableTracker = $state(false);

	async function setTracker(account: string, spec_url: string) {
		const { data, error } = await page.data.supabase.from(trackerTable).upsert({
			id: trackerTableId,
			account,
			spec_url
		});

		return { data, error };
	}

	async function resetTrackingInfo() {
		loading = true;
		success = false;
		error = false;

		const updateTracker = await setTracker('', '');

		if (updateTracker.error) {
			error = true;
			success = false;
			loading = false;
			return;
		}

		error = false;
		success = true;

		setTimeout(() => {
			account = '';
			spec_url = '';
			loading = false;
			trackingBuild = false;
			buildTrackerState.resetBuildTracker();
		}, 1000);
	}

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		success = false;
		error = false;

		const updateTracker = await setTracker(account, spec_url);

		if (updateTracker.error) {
			error = true;
			success = false;
			loading = false;
			return;
		}

		error = false;
		success = true;
		buildTrackerState.setBuildTracker(account);

		setTimeout(() => {
			loading = false;
			trackingBuild = true;
		}, 1000);
	}

	onMount(async () => {
		const { data, error } = await page.data.supabase.from(trackerTable).select('*').single();
		if (data && data.account && data.spec_url) {
			account = data.account;
			spec_url = data.spec_url;
			trackingBuild = true;
			buildTrackerState.setBuildTracker(account);
		}

		if (error) disableTracker = true;
	});
</script>

<div id="build-tracker" class:open>
	<button
		class:active={open}
		class="btn"
		disabled={disableTracker}
		onclick={() => {
			if (disableTracker) return;
			open = !open;
		}}
	>
		<span class="cta">Build Tracker</span>
	</button>
	<div class="build-tracker-dropdown">
		<h2>Build Tracker</h2>
		{#if trackingBuild}
			<h3>Tracking: {account}</h3>
		{/if}

		{#if trackingBuild}
			<div class="build-tracker-btn-group">
				<button
					class="btn"
					onclick={() => {
						navigator.clipboard.writeText(account);
					}}>Copy Account</button
				>
				<a class="btn" target="_blank" href="https://www.sesamehub.com/sites/{account}/config">
					Build Config
				</a>
				<a class="btn" target="_blank" href="https://www.sesamehub.com/sites/{account}/tools">
					Build Tools
				</a>
				<a class="btn" href={spec_url} target="_blank">SPEC</a>
				<a class="btn" href="http://localhost:8888/{account}/" target="_blank">Localhost</a>
				<a class="btn" href="http://{account}.sesamehub.com/" target="_blank">Live</a>
				<a class="btn" href="http://{account}.sesamehub.com/proofs/index.html" target="_blank">
					Proof
				</a>
				<a
					class="btn"
					href="http://{account}.sesamehub.com/forms/appointment-request/success"
					target="_blank"
				>
					APT REQ success page
				</a>
				<button class="btn" onclick={resetTrackingInfo}>
					{#if loading}
						<LoadingSpinner {loading} {success} {error} dim={44} />
					{:else}
						<span>Done?</span>
					{/if}
				</button>
			</div>
		{:else}
			<form {onsubmit}>
				<div class="form-control">
					<label>
						Account
						<input type="text" bind:value={account} required />
					</label>
				</div>
				<div class="form-control">
					<label>
						Spec URL
						<input type="text" bind:value={spec_url} required />
					</label>
				</div>
				<button class="btn">
					{#if loading}
						<LoadingSpinner {loading} {success} {error} dim={44} />
					{:else}
						<span>Track</span>
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>

<style lang="less">
	#build-tracker {
		position: relative;
		z-index: 3000;
		display: inline-block;
		vertical-align: top;
		.build-tracker-dropdown {
			position: absolute;
			bottom: calc(100% + 0.5em);
			width: 100%;
			min-width: 400px;
			background-color: var(--bg);
			border-radius: var(--border-radius);
			padding: 1em;
			border: 1px solid var(--border-color);
			box-shadow: var(--box-shadow);
			// hidden
			transition: opacity 0.33s ease;
			opacity: 0;
			pointer-events: none;
			right: 0;
			@media only screen and (max-width: 1023px) {
				min-width: auto;
			}
		}
		.form-control {
			margin-bottom: 1em;
		}
		.build-tracker-btn-group {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			gap: 5px;
		}

		&.open {
			.build-tracker-dropdown {
				opacity: 1;
				pointer-events: all;
			}
		}
	}
</style>
