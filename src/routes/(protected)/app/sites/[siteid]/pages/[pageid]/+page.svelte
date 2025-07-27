<script lang="ts">
	import ContentEditor from '$lib/components/content-editor/ContentEditor.svelte';
	import { createSettingsStore } from '$lib/components/content-editor/settingsStore';
	import Form from '$lib/components/form/Form.svelte';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import type { Site, SiteNavigationItem } from '$lib/types';
	import { setContext } from 'svelte';
	import type { PageData } from './$types';
	import { updateNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-page';
	import { updateFolderNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-folder';
	import { updateLinkNavItemFormConfig } from '$lib/form-configs/app/update-nav-item-link';

	let { data }: { data: PageData } = $props();
	const page = $state(data.page) as SiteNavigationItem;
	const site = $state(data.site) as Site;

	// page config by default
	let updateNavItemConfig = $state(updateNavItemFormConfig);

	// folder
	if (page.navigation_item_type === 'folder') updateNavItemConfig = updateFolderNavItemFormConfig;

	// link
	if (page.navigation_item_type === 'link') updateNavItemConfig = updateLinkNavItemFormConfig;

	const updateNavItemFormHandler = handleTriggerUpdate(updateNavItemConfig);
	if (page) updateConfigWithValues(updateNavItemConfig, page);

	const sampleJson = {
		root: {
			children: [
				{
					children: [
						{
							detail: 0,
							format: 0,
							mode: 'normal',
							style: '',
							text: 'Heading',
							type: 'text',
							version: 1
						},
						{
							detail: 2,
							format: 0,
							mode: 'normal',
							style: '',
							text: '\t',
							type: 'tab',
							version: 1
						}
					],
					direction: 'ltr',
					format: '',
					indent: 0,
					type: 'heading',
					version: 1,
					tag: 'h1'
				},
				{
					children: [
						{
							detail: 0,
							format: 0,
							mode: 'normal',
							style: '',
							text: 'Heading 2',
							type: 'text',
							version: 1
						}
					],
					direction: 'ltr',
					format: '',
					indent: 0,
					type: 'heading',
					version: 1,
					tag: 'h2'
				},
				{
					children: [
						{
							detail: 0,
							format: 0,
							mode: 'normal',
							style: '',
							text: 'Heading 3',
							type: 'text',
							version: 1
						}
					],
					direction: 'ltr',
					format: '',
					indent: 0,
					type: 'heading',
					version: 1,
					tag: 'h3'
				},
				{
					children: [
						{
							children: [
								{
									detail: 0,
									format: 0,
									mode: 'normal',
									style: '',
									text: 'list item',
									type: 'text',
									version: 1
								}
							],
							direction: 'ltr',
							format: '',
							indent: 0,
							type: 'listitem',
							version: 1,
							value: 1
						},
						{
							children: [
								{
									detail: 0,
									format: 0,
									mode: 'normal',
									style: '',
									text: 'list item',
									type: 'text',
									version: 1
								}
							],
							direction: 'ltr',
							format: '',
							indent: 0,
							type: 'listitem',
							version: 1,
							value: 2
						},
						{
							children: [
								{
									detail: 0,
									format: 0,
									mode: 'normal',
									style: '',
									text: 'list item',
									type: 'text',
									version: 1
								}
							],
							direction: 'ltr',
							format: '',
							indent: 0,
							type: 'listitem',
							version: 1,
							value: 3
						}
					],
					direction: 'ltr',
					format: '',
					indent: 0,
					type: 'list',
					version: 1,
					listType: 'bullet',
					start: 1,
					tag: 'ul'
				}
			],
			direction: 'ltr',
			format: '',
			indent: 0,
			type: 'root',
			version: 1
		}
	};

	// Lexical Editor
	const settings = createSettingsStore();
	settings.setOption('emptyEditor', false);
	setContext('settings', settings);

	// save json to db
	function onsave(json: string) {
		console.log('saving json...', json);
	}

	// page layout
	let pageComponents = [
		{
			name: 'slideshow'
		},
		{
			name: 'Spotlight'
		},
		{
			name: 'Meet the owner'
		}
	];
</script>

<section>
	<div class="container">
		<h1>Editing {page.title} ({page.navigation_item_type})</h1>
		<a class="btn" href="/app/sites/{site.id}/pages">Go back</a>
	</div>
</section>

<section>
	<div class="container">
		<h2>1. Search Engine Optimization & Meta Tags</h2>
		<!-- 
		<p>account: {site.site_name}</p>
		<ContentEditor {onsave} json={sampleJson} /> -->
		<Form
			name="update nav item form"
			config={updateNavItemConfig}
			clearOnSuccess={false}
			triggerUpdate={updateNavItemFormHandler}
		/>
	</div>
</section>

<section>
	<div class="container">
		<h2>2. Page Layout</h2>
		<ul>
			{#each pageComponents as component, index}
				<li>
					{component.name}
					<button>reorder up</button>
					<button>reorder down</button>
					<button>config</button>
				</li>
			{/each}
		</ul>
	</div>
</section>
