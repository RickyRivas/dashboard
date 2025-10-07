<script lang="ts">
	import ToggleFavorite from '$lib/components/code/ToggleFavorite.svelte';
	import Logo from '$lib/Logo.svelte';
	import moment from 'moment';
	import type { PageProps } from './$types';
	import { CldImage, configureCloudinary } from 'svelte-cloudinary';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import CopyButton from '$lib/components/code/CopyButton.svelte';

	let { data }: PageProps = $props();
	const { codeAsset, category } = data;

	configureCloudinary({
		cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME
	});

	// hard coding tabs here. TODO
	type Lang = 'html' | 'css' | 'javascript';
	type Tab = {
		value: string;
		lang: Lang;
		index: number;
	};
	let tabs: Tab[] = [
		{ value: codeAsset.html, lang: 'html', index: 0 },
		{ value: codeAsset.css, lang: 'css', index: 1 },
		{ value: codeAsset.javascript, lang: 'javascript', index: 2 }
	];

	let selectedTab = $state(tabs[0]);
	let value = $derived(selectedTab.value);
</script>

<section class="default-styling">
	<div class="container">
		<CardGroup>
			<Card heading={codeAsset.title}>
				<p class="description">{codeAsset.description || 'No description.'}</p>
				<ToggleFavorite id={codeAsset.id} favorite={codeAsset.favorite} />
				<div class="thumbnail" class:placeholder={!codeAsset.thumbnailurl}>
					{#if codeAsset.thumbnailurl}
						<CldImage width="300" height="300" src={codeAsset.thumbnailurl} alt="" crop="pad" />
					{:else}
						<Logo />
					{/if}
				</div>
				<div class="manager-editor-lang-btns">
					{#each tabs as tab}
						<button
							class="btn"
							type="button"
							class:active={selectedTab.index === tab.index}
							onclick={() => {
								selectedTab = tab;
							}}
						>
							{tab.lang}
						</button>
					{/each}
					<CopyButton
						lang={selectedTab.lang}
						snippet={selectedTab.value}
						text="Copy {selectedTab.lang.toUpperCase()}"
					/>
				</div>
				<CodeEditor
					readonly={true}
					doc={value.toString()}
					lang={selectedTab.lang}
					onupdatevalue={(newValue) => {}}
				/>
				<p class="time">
					Created: {moment(codeAsset.created_at).format('MMMM D, YYYY [at] h:mm A')}
				</p>
				<p class="time">
					Updated: {moment(codeAsset.updated_at).format('MMMM D, YYYY [at] h:mm A')}
				</p>
				<!-- <a class="btn" href={`/app/components/${category}`}>Go back</a> -->
				<a class="btn" href={`/app/library?type=${codeAsset.type}&category=${category}`}>Go back</a>
				<a class="btn" href={`/app/manager?code_asset_id=${codeAsset.id}`}>Edit code asset</a>
			</Card>
		</CardGroup>
	</div>
</section>

<style lang="less">
	.description {
		margin-bottom: 1em;
	}
	.thumbnail {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		aspect-ratio: ~'1 / 1';
		background-color: var(--bg);
		color: var(--text);
		border: 1px solid var(--border-color);
		max-width: (300/20em);
		margin-bottom: 1em;
		margin-top: 1em;

		&.placeholder {
			padding: 1em;
		}
	}

	p.time {
		line-height: 3;
		margin: 0;
		font-size: 16px;
	}
</style>
