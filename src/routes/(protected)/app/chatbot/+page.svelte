<script lang="ts">
	import { enhance } from '$app/forms';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import type Anthropic from '@anthropic-ai/sdk';

	let prompt = $state('');
	let generating = $state(false);
	let disableForm = $state(false);
	let generateSuccess = $state(false);
	let generateFailure = $state(false);

	let msgText = $state('');
	let msgType = $state('');
	let msgs: Anthropic.Message[] = $state([]);

	function generate({ formElement, formData, action, cancel, submitter }) {
		generating = true;
		generateSuccess = false;
		generateFailure = false;

		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
			if (result.type === 'success') {
				// ui
				generateSuccess = true;
				console.log(result);

				// update answer
				const msg: Anthropic.Message = result.data.msg;

				// if text type
				if (msg.content[0].type === 'text') {
					msgText = msg.content[0].text;
				}

				// push to answers array
				msgs.push(msg);

				// clear
				prompt = '';
			} else {
				// ui
				generateFailure = true;

				// clear
				prompt = '';

				console.log(result);
			}

			// reset form fields and show ui for a sec
			update({ reset: true });
			setTimeout(() => (generating = false), 1000);

			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}

	$inspect(generating);
</script>

<section>
	<div class="container">
		<h1>Chatbot</h1>

		<!-- prompt -->
		<form method="post" class="default-styling" use:enhance={generate}>
			<div class="form-control">
				<textarea name="prompt" id="prompt" bind:value={prompt} placeholder="ask a question"
				></textarea>
			</div>
			<!-- submit -->
			<button
				class="btn"
				disabled={disableForm}
				class:error={generateFailure}
				class:success={generateSuccess}
			>
				{#if generating}
					<LoadingSpinner
						dim={44}
						loading={generating}
						success={generateSuccess}
						error={generateFailure}
					/>
				{:else}
					<span>Submit</span>
				{/if}
			</button>
		</form>

		<div class="result-box">
			<h2>Answer:</h2>
			<div class="form-control">
				<textarea name="" id="" disabled bind:value={msgText}></textarea>
			</div>

			<hr />

			<h2>show prev answers:</h2>
			{#if msgs.length > 0}
				<ul>
					{#key msgs}
						{#each msgs as msg}
							<li><button>view message ({msg.id})</button></li>
						{/each}
					{/key}
				</ul>
			{:else}
				<p>No history!</p>
			{/if}
		</div>
	</div>
</section>

<style lang="less">
	.result-box {
		margin-top: 1em;
		border: 1px solid var(--primary);
		padding: 1em;
		border-radius: 1em;
	}
</style>
