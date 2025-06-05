<script lang="ts">
	import type {
		InputAttributes,
		LabelConfig,
		FieldState,
		TriggerUpdate,
		FormConfig
	} from '$lib/form-types';
	import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
	import { enhance } from '$app/forms';
	import { formHandler } from '$lib/form-helpers';

	const {
		config,
		configuration,
		fieldState,
		triggerUpdate,
		index
	}: {
		config: FormConfig;
		configuration: { inputAttributes: InputAttributes; labelConfig: LabelConfig };
		fieldState: FieldState;
		triggerUpdate: TriggerUpdate;
		index: number;
	} = $props();

	let value = $state(configuration.inputAttributes.value);

	$effect(() => {
		triggerUpdate(index, value);
	});

	let form: HTMLFormElement;

	function submitForm() {
		// if (!value.toString().trim()) return;
		if (form) form.requestSubmit();
	}
</script>

<form
	name="autoform-{configuration.inputAttributes.name}"
	bind:this={form}
	{...config.formAttributes}
	use:enhance={formHandler(config)}
>
	<div class="form-control">
		<label>
			{configuration.labelConfig.text}
			<input
				{...configuration.inputAttributes}
				class:error={fieldState.hasError}
				class:success={fieldState.showSuccess}
				bind:value
				onblur={submitForm}
			/>
		</label>
		{#if fieldState.hasError && fieldState.statusMessage}
			<ErrorMessage errorMessage={fieldState.statusMessage} />
		{/if}
	</div>
</form>
