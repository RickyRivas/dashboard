<script>
	import { getContext } from 'svelte';
	import { dateToString } from 'wx-lib-dom';
	import { formatSize } from 'wx-filemanager-store';
	import Icon from './ui/Icon.svelte';

	const { preview, icon } = getContext('filemanager-store').templates;

	const api = getContext('filemanager-store');

	let { narrowMode, extraInfo } = $props();

	let { panels, activePanel, preview: rPreview, search } = api.getReactiveState();

	const locale = getContext('wx-i18n');
	const _ = locale.getGroup('filemanager');
	const format = dateToString('%D, %d %F %Y, %H:%i', locale.getRaw().calendar);

	const found = $derived($search && !$panels[$activePanel]._selected.length);
	const items = $derived(found ? $panels[$activePanel]._files : $panels[$activePanel]._selected);

	function downloadFile() {
		api.exec('download-file', {
			id: items[0]
		});
	}

	function getTotalCount(folders, files) {
		return (
			(folders ? `${folders} ${_(folders > 1 ? 'folders' : 'folder')} ` : '') +
			(files ? `${files} ${_(files > 1 ? 'files' : 'file')}` : '')
		);
	}

	function closePreview() {
		api.exec('show-preview', { mode: !$rPreview });
	}

	function getItemType(item) {
		return item.type === 'folder' ? _('Folder') : item.ext || _('Unknown file');
	}

	const basic = $derived.by(() => {
		let name, item, previewSrc, iconSrc, showDownloadIcon, type, totalCount, totalSize;

		if (items.length === 1 && !found) {
			item = items[0];
			name = item.name;
			const prev = preview(item, 400, 500);
			if (prev) {
				previewSrc = prev;
				iconSrc = '';
			} else {
				iconSrc = icon(item, 'big');
				previewSrc = '';
			}
			showDownloadIcon = item.type !== 'folder';
		} else {
			item = showDownloadIcon = null;
			name = '';
			if (items.length) {
				let sum = 0;
				let folders = 0;
				let files = 0;
				let extArr = [];
				let incorrectSize;
				items.forEach((item) => {
					if (typeof item.size === 'undefined') {
						incorrectSize = true;
						sum = undefined;
					}

					if (!incorrectSize) {
						sum += item.size;
					}

					extArr.push(getItemType(item));
					item.type === 'folder' ? folders++ : files++;
				});

				const singleExt = new Set(extArr);
				type = singleExt.size > 1 ? _('multiple') : [...singleExt][0];
				totalCount = getTotalCount(folders, files);
				totalSize = sum;
				if (!found) name = _('Multiple files');
			}
			iconSrc = icon(
				{
					type: found ? 'search' : items.length ? 'multiple' : 'none'
				},
				'big'
			);
			previewSrc = '';
		}

		return {
			name,
			item,
			previewSrc,
			iconSrc,
			showDownloadIcon,
			type,
			totalCount,
			totalSize
		};
	});

	async function getExtraInfo(item) {
		if (!extraInfo || !item) return null;
		try {
			return await extraInfo(item);
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	const info = $derived(getExtraInfo(basic.item));
</script>

<div class="wx-wrapper">
	{#if items.length}
		<div class="wx-preview">
			<div class="wx-toolbar">
				<div class="wx-name">{name}</div>
				<div class="wx-icons">
					{#if basic.showDownloadIcon}
						<Icon name="download" onclick={downloadFile} />
					{/if}
					{#if narrowMode}
						<Icon name="close" onclick={closePreview} />
					{/if}
				</div>
			</div>
			{#if basic.previewSrc}
				<div class="wx-img-wrapper">
					<img src={basic.previewSrc} alt={_('A miniature file preview')} />
				</div>
			{:else if basic.iconSrc}
				<div class="wx-icon-wrapper">
					<img src={basic.iconSrc} alt={_('A miniature file preview')} />
				</div>
			{:else}
				<div class="wx-icon-wrapper">
					{#if basic.item}
						<i class="wx-icon wxi-{basic.item.type}"></i>
					{:else}
						<i class="wx-icon wxi-{found ? 'search' : 'file-multiple-outline'}"></i>
					{/if}
				</div>
			{/if}
		</div>
		<div class="wx-info-panel">
			<div class="wx-title">{found ? _('Found') : _('Information')}</div>
			<div class="wx-list">
				{#if basic.item}
					<span class="wx-name">{_('Type')}</span>
					<span class="wx-value">{getItemType(basic.item)}</span>
					{#if typeof basic.item.size !== 'undefined'}
						<span class="wx-name">{_('Size')}</span>
						<span class="wx-value">{formatSize(basic.item.size)}</span>
					{/if}
					<span class="wx-name">{_('Date')}</span>
					<span class="wx-value">{format(basic.item.date)} </span>
				{:else}
					<span class="wx-name">{_('Count')}</span>
					<span class="wx-value">{basic.totalCount}</span>
					<span class="wx-name">{_('Type')}</span>
					<span class="wx-value">{basic.type}</span>
					{#if typeof basic.totalSize !== 'undefined'}
						<span class="wx-name">{_('Size')}</span>
						<span class="wx-value">{formatSize(basic.totalSize)}</span>
					{/if}
				{/if}
				{#await info then values}
					{#if values}
						{#each Object.entries(values) as [name, value]}
							<span class="wx-name">{name}</span>
							<span class="wx-value">{value}</span>
						{/each}
					{/if}
				{/await}
			</div>
		</div>
	{:else}
		<div class="wx-no-info-panel">
			<div class="wx-toolbar">
				<div class="wx-name">{name}</div>
				<div class="wx-icons">
					{#if narrowMode}
						<Icon name="close" onclick={closePreview} />
					{/if}
				</div>
			</div>
			<div class="wx-no-info-wrapper">
				<div class="wx-no-info">
					{#if basic.previewSrc}
						<div class="wx-img-wrapper">
							<img src={basic.previewSrc} alt={_('A miniature file preview')} />
						</div>
					{:else if basic.iconSrc}
						<div class="wx-icon-wrapper">
							<img src={basic.iconSrc} alt={_('A miniature file preview')} />
						</div>
					{:else}
						<div class="wx-icon-wrapper">
							<i class="wx-icon wxi-{found ? 'search' : 'message-question-outline'}"></i>
						</div>
					{/if}
					<span class="wx-text">{found ? '' : _('Select file or folder to view details')}</span>
				</div>
			</div>
		</div>
	{/if}
</div>
