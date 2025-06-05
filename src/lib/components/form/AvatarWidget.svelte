<script lang="ts">
	// cloudinary
	import { avatarPlaceholderPath } from '$lib/auth-controller.svelte';
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
	let uploadWidget;

	$effect(() => {
		triggerUpdate(index, value);
	});

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

	function uploadAvatar() {
		if (uploadWidget) uploadWidget.open();
	}

	function removeAvatar() {
		if (value === avatarPlaceholderPath) return;
		value = avatarPlaceholderPath;
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
</script>

<div class="form-control">
	<div>
		<label>
			{configuration.labelConfig.text}
			<input
				type="hidden"
				name={configuration.inputAttributes.name}
				value={configuration.inputAttributes.value}
				required={configuration.inputAttributes.required}
			/>
		</label>
	</div>
	<div class="small-avatar">
		<img
			src={configuration.inputAttributes.value.toString() || avatarPlaceholderPath}
			alt="avatar placeholder"
			width="40"
			height="40"
		/>
	</div>

	<button onclick={uploadAvatar} type="button" class="btn"> Upload Image</button>
	<button
		onclick={removeAvatar}
		type="button"
		class="btn"
		disabled={value === avatarPlaceholderPath}
	>
		Remove Image
	</button>
	{#if fieldState.hasError && fieldState.statusMessage}
		<ErrorMessage errorMessage={fieldState.statusMessage} />
	{/if}
</div>
