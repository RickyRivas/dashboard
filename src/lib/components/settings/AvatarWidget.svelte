<script lang="ts">
	// cloudinary
	import { avatarPlaceholderPath } from '$lib/auth-controller';
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { onMount } from 'svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_PRESET } from '$env/static/public';

	let { temp_avatar_url = $bindable() }: { temp_avatar_url: string } = $props();

	let uploadWidget;

	let onUpload = (error, result, widget) => {
		if (!error && result) {
			temp_avatar_url = result.info.url;
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
		if (temp_avatar_url === avatarPlaceholderPath) return;
		temp_avatar_url = avatarPlaceholderPath;
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

<div class="small-avatar">
	<img
		src={temp_avatar_url || avatarPlaceholderPath}
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
	disabled={temp_avatar_url === avatarPlaceholderPath}
>
	Remove Image</button
>
