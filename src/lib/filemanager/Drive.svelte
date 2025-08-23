<script>
	import { getContext } from 'svelte';
	import { formatSize } from 'wx-filemanager-store';

	const api = getContext('filemanager-store');
	const drive = api.getReactiveState().drive;
	const _ = getContext('wx-i18n').getGroup('filemanager');

	let used = $derived($drive ? $drive.used : '');
	let total = $derived($drive ? $drive.total : '');
</script>

{#if used && total}
	<div class="wx-drive">
		<progress value={used} max={total} class="wx-progress"></progress>
		<p>{formatSize(used)} {_('of')} {formatSize(total)} {_('used')}</p>
	</div>
{/if}
