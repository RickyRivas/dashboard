<script lang="ts">
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_PRESET } from '$env/static/public';

	import type { InputAttributes, LabelConfig, FieldState, TriggerUpdate } from '$lib/form-types';
	import ErrorMessage from './ErrorMessage.svelte';
	const {
		configuration,
		fieldState,
		triggerUpdate,
		index
	}: {
		configuration: { inputAttributes: InputAttributes; labelConfig: LabelConfig };
		fieldState: FieldState;
		triggerUpdate: TriggerUpdate;
		index: number;
	} = $props();

	let value = $state(configuration.inputAttributes.value);

	$effect(() => {
		triggerUpdate(index, value);
	});

	let uploadWidget;

	let onUpload = (error, result, widget) => {
		if (!error && result) {
			value = result.info.url;
		}
	};

	function cldCallback(error, result) {
		if (error || result.event === 'success') {
			onUpload && onUpload(error, result, uploadWidget);
		}
	}

	function uploadThumbnail() {
		if (uploadWidget) uploadWidget.open();
	}

	configureCloudinary({
		cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME
	});

	onMount(() => {
		function onIdle() {
			if (!uploadWidget) {
				uploadWidget = window.cloudinary.createUploadWidget(
					{
						cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
						uploadPreset: PUBLIC_CLOUDINARY_PRESET
					},
					cldCallback
				);
			}
		}

		'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);
	});

	// $inspect('c', value);
</script>

<div class="form-control">
	<label>
		{configuration.labelConfig.text}
		<input
			{...configuration.inputAttributes}
			class:error={fieldState.hasError}
			class:success={fieldState.showSuccess}
			bind:value
		/>
	</label>
	<button onclick={uploadThumbnail} type="button" class="btn cloudinary-upload-btn">
		Upload Image</button
	>
	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
