<script lang="ts">
	import { onMount } from 'svelte';
	import CustomFileManager from '$lib/filemanager/CustomFileManager.svelte';
	import Willow from '$lib/filemanager/themes/Willow.svelte';
	import RestDataProvider from '$lib/filemanager/RestDataProvider';
	import { Globals, WillowDark, Material, Locale, popupContainer } from 'wx-svelte-core';

	const server = '/api/local-file-manager';
	const restProvider = new RestDataProvider(server); // init provider

	let fmApi = $state();
	let data = $state([]);
	let drive = $state({ used: 0, total: 0 });

	const init = (api) => {
		// intercept download-file event & make sure full path is passed for api
		api.intercept('download-file', (ev) => {
			// console.log('intercept download-file', ev, ev.id);
			// const fileData = ev.id;
			// if (fileData) {
			// 	ev.file = fileData;
			// 	// needed for download-file
			// 	ev.relativePath = fileData.relativePath;
			// }
			// return ev;
		});

		api.setNext(restProvider);
	};

	function getLink(id, download) {
		return server + '/direct?id=' + encodeURIComponent(id) + (download ? '&download=true' : '');
	}

	// on refresh & view folder
	async function loadData(ev) {
		const id = ev.id;
		const url = id ? `${server}?parent-id=${encodeURIComponent(id)}` : `${server}`;

		const response = await fetch(url);
		const originalData = await response.json();

		console.log('loadData data:', originalData);

		if (originalData && fmApi) {
			// console.log(parseDates(originalData));
			fmApi.exec('provide-data', { id: ev.id, data: parseDates(originalData) });
		}
	}

	function parseDates(data) {
		data.forEach((item) => {
			if (item.date) item.date = new Date(item.date);
		});
		return data;
	}

	onMount(async () => {
		const response = await fetch(server);
		const result = await response.json();

		console.log('fetched local files:', result);

		if (result) data = parseDates(result);
	});
</script>

<section>
	<div class="container">
		<Willow>
			<div class="wx-willow-theme content" use:popupContainer>
				<Locale>
					<Globals>
						<CustomFileManager bind:this={fmApi} {init} {data} {drive} onrequestdata={loadData} />
					</Globals>
				</Locale>
			</div>
		</Willow>
	</div>
</section>
