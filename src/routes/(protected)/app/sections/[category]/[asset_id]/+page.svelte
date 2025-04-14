<script lang="ts">
	import ToggleFavorite from '$lib/components/code/ToggleFavorite.svelte';
	import Logo from '$lib/Logo.svelte';
	import moment from 'moment';
	import type { PageProps } from './$types';
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import CodeDisplayPanel from '$lib/components/code/CodeDisplayPanel.svelte';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';

	let { data }: PageProps = $props();
	const { codeAsset, category } = data;

	configureCloudinary({
		cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME
	});
</script>

<section id="full-page-code-asset">
	<div class="container">
		<CardGroup>
			<Card heading={codeAsset.title}>
				<p class="description">{codeAsset.description || 'No description.'}</p>
				<ToggleFavorite id={codeAsset.id} favorite={codeAsset.favorite} dim={44} />
				<div class="thumbnail" class:placeholder={!codeAsset.thumbnailurl}>
					{#if codeAsset.thumbnailurl}
						<CldImage width="300" height="300" src={codeAsset.thumbnailurl} alt="" crop="pad" />
					{:else}
						<Logo />
					{/if}
				</div>
				<CodeDisplayPanel {codeAsset} />
				<p class="time">
					Created: {moment(codeAsset.created_at).format('MMMM D, YYYY [at] h:mm A')}
				</p>
				<p class="time">
					Updated: {moment(codeAsset.updated_at).format('MMMM D, YYYY [at] h:mm A')}
				</p>
				<a class="btn" href={`/app/sections/${category}`}>Go back</a>
				<a class="btn" href={`/app/manager?code_asset_id=${codeAsset.id}`}>Edit code asset</a>
			</Card>
		</CardGroup>
	</div>
</section>
