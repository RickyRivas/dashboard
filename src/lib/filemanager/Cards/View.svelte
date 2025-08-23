<script>
	import { getContext } from 'svelte';

	import Breadcrumbs from '../Breadcrumbs.svelte';
	import Panel from './Panel.svelte';
	import UploadDropArea from '../UploadDropArea.svelte';

	const api = getContext('filemanager-store');
	const { activePanel } = api.getReactiveState();
</script>

<div class="wx-wrapper">
	<Breadcrumbs panel={$activePanel} />
	<UploadDropArea>
		<Panel />
	</UploadDropArea>
</div>
