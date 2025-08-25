<script lang="ts">
	import { onMount } from 'svelte';
	import CustomFileManager from '$lib/filemanager/CustomFileManager.svelte';
	import RestDataProvider from '$lib/filemanager/RestDataProvider';
	import { Globals, Locale } from 'wx-svelte-core';
	import CustomTheme from '$lib/filemanager/themes/CustomTheme.svelte';
	import type { PageProps } from '../$types';
	import { Filemanager, getMenuOptions } from 'wx-svelte-filemanager';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ModalImageBuilder from '$lib/components/image-builder/ModalImageBuilder.svelte';
	const imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

	const { data }: PageProps = $props();

	// image modal
	let showGeneratorModal = $state(false);
	let selectedImage = $state();

	// TODO: restructure data
	const {
		account: { account }
	} = $derived(data);

	const directory = encodeURIComponent(`/applications/mamp/www/${account.trim()}/www/assets`);
	const server = `/api/local-file-manager?directory=${directory}`;
	const restProvider = new RestDataProvider(server); // init provider

	let fmApi = $state();
	let fmData = $state([]);
	let drive = $state({ used: 0, total: 0 });

	const init = (api) => {
		// custom
		api.on('markup-generator', (ev) => {
			if (ev.item) {
				selectedImage = ev.item;
				showGeneratorModal = true;
			}
		});

		api.setNext(restProvider);
	};

	// function getLink(id, download) {
	// 	return server + '/direct?id=' + encodeURIComponent(id) + (download ? '&download=true' : '');
	// }

	// on refresh & view folder
	async function loadData(ev) {
		const id = ev.id;
		const url = id ? `${server}&parentid=${encodeURIComponent(id)}` : `${server}`;
		// console.log(id, url);

		const response = await fetch(url);
		const newData = await response.json();

		if (newData && fmApi) {
			// console.log(newData);
			fmApi.exec('provide-data', { id: ev.id, data: parseDates(newData) });
		}
	}

	function parseDates(data) {
		data.forEach((item) => {
			if (item.date) item.date = new Date(item.date);
		});
		return data;
	}

	function menuOptions(mode, item) {
		// console.log(getMenuOptions(mode));
		switch (mode) {
			case 'file':
				if (imgTypes.includes(item.ext.toLowerCase()))
					return [
						// add our new option
						{
							icon: '',
							text: 'Markup Generator',
							hotkey: '',
							// also the action name
							id: 'markup-generator'
						},
						{
							type: 'separator'
						},
						...getMenuOptions(mode)
					];
			default:
				return getMenuOptions(mode);
		}
	}

	onMount(async () => {
		if (account) {
			const response = await fetch(server);
			const result = await response.json();

			// console.log('fetched local files:', result);

			if (result) {
				fmData = parseDates(result);
			}
		}
	});
</script>

<section>
	<div class="container">
		{#if account}
			<CustomTheme>
				<!-- <div class="wx-willow-theme content" use:popupContainer> -->
				<Locale>
					<Globals>
						<CustomFileManager
							bind:this={fmApi}
							{init}
							data={fmData}
							{drive}
							onrequestdata={loadData}
							{menuOptions}
						/>
					</Globals>
				</Locale>
				<!-- </div> -->
			</CustomTheme>
		{:else}
			<p>Enter an account to enable file manager.</p>
		{/if}
	</div>
</section>

{#if showGeneratorModal}
	<Modal
		closeModal={() => {
			selectedImage = '';
			showGeneratorModal = false;
		}}
	>
		{#snippet modalContent()}
			<ModalImageBuilder img={selectedImage} {account} />
		{/snippet}
	</Modal>
{/if}
