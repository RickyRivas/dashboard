<script lang="ts">
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_PRESET } from '$env/static/public';

	import ErrorMessage from './ErrorMessage.svelte';

	interface Prop {
		name: string;
		label: string;
		value: string;
		type: string;
		placeholder: string;
		required: boolean;
		error: string | null;
		disabled: boolean;
		options?: string[];
		oauthUserDisable?: boolean;
		cloudinary?: boolean;
		step?: string | undefined;
		autocomplete?:
			| 'off'
			| 'on'
			// Sign-in/credentials
			| 'username'
			| 'current-password'
			| 'new-password'
			// Contact
			| 'email'
			| 'tel'
			// Personal info
			| 'name'
			| 'given-name'
			| 'family-name'
			| 'nickname'
			// Address
			| 'street-address'
			| 'address-line1'
			| 'address-line2'
			| 'address-level1'
			| 'address-level2'
			| 'postal-code'
			| 'country'
			// Payment
			| 'cc-name'
			| 'cc-number'
			| 'cc-exp'
			| 'cc-exp-month'
			| 'cc-exp-year'
			| 'cc-csc'
			// One-time code
			| 'one-time-code'
			| undefined;
		id: string;
	}

	let {
		label,
		name,
		value = $bindable(),
		type = 'text',
		placeholder = '',
		required = false,
		options = [],
		error = $bindable(null),
		disabled = $bindable(false),
		autocomplete = undefined,
		oauthUserDisable = false,
		cloudinary = false,
		step = undefined,
		id = `input-${Math.random().toString(36).substr(2, 9)}`
	}: Prop = $props();

	// Reference to the input element
	let inputElement: HTMLInputElement;

	// Handle input changes
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
	}

	// cloudinary (for uploads)
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
</script>

<div class="form-control">
	<!-- radio/checkboxes -->
	{#if type === 'radio'}
		<fieldset>
			<legend>{label}{required ? '*' : ''}</legend>
			<div class="form-radio-group">
				{#each options as option}
					<label>
						<input
							type="radio"
							{name}
							bind:group={value}
							value={option}
							onchange={(e) => {
								value = e.target.value;
							}}
						/>
						{option}
					</label>
				{/each}
			</div>
		</fieldset>
	{:else if type === 'checkbox'}
		<label>
			<input type="checkbox" {name} bind:checked={value} />
			{label}{required ? '*' : ''}
		</label>
	{:else if type === 'select'}
		<label>
			{label}
			<select {name} bind:value>
				<option value="">Please select an option</option>
				{#each options as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
	{:else if type === 'textarea'}
		<label>
			{label}
			<textarea {name} bind:value></textarea>
		</label>
	{:else}
		<!-- everything else -->
		{#if label}
			<label for={id} class:required>
				{label}
				{oauthUserDisable ? '- Change Email through your provider.' : ''}
			</label>
		{/if}

		<!-- oauthUserDisable is for fields that users signed in with a provider cant change. -->
		{#if oauthUserDisable}
			<input
				{id}
				{type}
				{name}
				{placeholder}
				{required}
				disabled={true}
				{value}
				{autocomplete}
				{step}
				bind:this={inputElement}
				class:error
			/>
		{:else}
			<input
				{id}
				{type}
				{name}
				{placeholder}
				{required}
				{disabled}
				{value}
				{autocomplete}
				{step}
				bind:this={inputElement}
				class:error
				oninput={handleInput}
			/>
		{/if}

		{#if cloudinary}
			<button onclick={uploadThumbnail} type="button" class="btn cloudinary-upload-btn">
				Upload Image</button
			>
		{/if}
	{/if}

	{#if error}
		<ErrorMessage errorMessage={error} />
	{/if}
</div>
