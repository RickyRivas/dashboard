<script>
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { getBuildTrackerInfo, setBuildTrackerInfo } from '$lib/supabase-db';
	import { onMount } from 'svelte';

	let open = $state(false);
	let trackingBuild = $state(false);
	let spec_url = $state('');
	let temp_pw = $state('');
	let account = $state('');

	let loading = $state(false);
	let success = $state(false);
	let error = $state(false);

	async function resetTrackingInfo() {
		loading = true;
		const result = await setBuildTrackerInfo({
			account: '',
			spec_url: '',
			temp_pw
		});

		if (result.success) {
			success = true;
			error = false;
			account = '';
			spec_url = '';

			setTimeout(() => {
				open = false;
				loading = false;
				trackingBuild = false;
			}, 1000);
		}
	}

	async function setNewTracker() {
		if (!account || !spec_url) {
			open = false;
			return;
		}

		loading = true;
		const result = await setBuildTrackerInfo({ spec_url, temp_pw, account });

		if (result.success) {
			success = true;
			error = false;
			setTimeout(() => {
				trackingBuild = true;
				loading = false;
			}, 1000);
		}
	}

	onMount(async () => {
		const result = await getBuildTrackerInfo();
		account = result.data.account;
		spec_url = result.data.spec_url;
		temp_pw = result.data.temp_pw;

		if (account && spec_url) trackingBuild = true;
	});
</script>

<div id="build-tracker" class:open>
	<button
		class="btn"
		onclick={() => {
			open = !open;
		}}
	>
		<span>Build Tracker</span>
	</button>
	<div class="build-tracker-dropdown">
		<h2>Build Tracker</h2>
		{#if trackingBuild}
			<h3>Tracking: {account}</h3>
		{/if}

		{#if trackingBuild}
			<div class="build-tracker-btn-group">
				{#if temp_pw}
					<button
						class="btn"
						onclick={() => {
							navigator.clipboard.writeText(temp_pw);
						}}>Copy Temp PW</button
					>
				{/if}
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
				<a class="btn" href={spec_url} target="_blank">Go to spec url</a>
				<a class="btn" href="http://localhost:8888/{account}/" target="_blank">localhost</a>
				<a class="btn" href="http://{account}.sesamehub.com/" target="_blank">live</a>
				<a class="btn" href="http://{account}.sesamehub.com/proofs/index.html" target="_blank">
					proof</a
				>
				<a
					class="btn"
					href="http://{account}.sesamehub.com/forms/appointment-request/success"
					target="_blank"
				>
					APT REQ success page
				</a>
				<button class="btn" onclick={resetTrackingInfo}>
					{#if loading}
						<LoadingSpinner bind:loading bind:success bind:error dim={44} />
					{:else}
						<span>Done?</span>
					{/if}
				</button>
			</div>
		{:else}
			{#if temp_pw}
				<button
					class="btn"
					onclick={() => {
						navigator.clipboard.writeText(temp_pw);
					}}>Copy Temp PW</button
				>
			{/if}
			<div class="form-control">
				<label>
					Account
					<input type="text" bind:value={account} />
				</label>
			</div>
			<div class="form-control">
				<label>
					Spec URL
					<input type="text" bind:value={spec_url} />
				</label>
			</div>
			<div class="form-control">
				<label>
					Temp PW
					<input type="text" bind:value={temp_pw} />
				</label>
			</div>
			<button class="btn" onclick={setNewTracker}>
				{#if loading}
					<LoadingSpinner bind:loading bind:success bind:error dim={44} />
				{:else}
					<span>Track</span>
				{/if}
			</button>
		{/if}
	</div>
</div>

<style lang="less">
	#build-tracker {
		position: relative;
		z-index: 3000;
		.build-tracker-dropdown {
			position: absolute;
			top: calc(100% + 0.5em);
			width: 100%;
			min-width: 400px;
			background-color: var(--bg);
			border-radius: var(--border-radius);
			padding: 1em;
			border: 1px solid var(--border-color);
			// hidden
			transition: opacity 0.33s ease;
			opacity: 0;
			pointer-events: none;
		}
		.form-control {
			margin-bottom: 1em;
		}
		.build-tracker-btn-group {
			display: flex;
			flex-wrap: wrap;
			gap: 5px;
		}

		&.open {
			> button {
				outline: 5px solid blue;
			}

			.build-tracker-dropdown {
				opacity: 1;
				pointer-events: all;
			}
		}
	}
</style>
