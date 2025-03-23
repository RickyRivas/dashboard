<script lang="ts">
	import Logo from '$lib/Logo.svelte';
	import type { CodeAsset } from '$lib/types';
	let { href, codeAsset }: { href: string; codeAsset: CodeAsset } = $props();

	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	configureCloudinary({
		cloudName: 'detngn1i8'
	});
</script>

<a class="code-asset-link" {href}>
	<div class="thumbnail" class:placeholder={!codeAsset.thumbnailurl}>
		{#if codeAsset.thumbnailurl}
			<CldImage width="300" height="300" src={codeAsset.thumbnailurl} alt="" crop="pad" />
		{:else}
			<Logo />
		{/if}
	</div>
	<h3>{`Title: ${codeAsset.title}`}</h3>
</a>
