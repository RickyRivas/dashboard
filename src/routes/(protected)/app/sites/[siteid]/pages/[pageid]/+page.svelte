<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { editPageFormConfig } from '$lib/form-configs/app/edit-page';
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import type { Site, SitePage } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const page = $state(data.page) as SitePage;
	const site = $state(data.site) as Site;

	let updatePageConfig = $state(editPageFormConfig);
	const updatePageFormHandler = handleTriggerUpdate(updatePageConfig);
	if (page) updateConfigWithValues(updatePageConfig, page);
</script>

<section>
	<div class="container">
		<h1>Editing {page.title} page</h1>
		<p>account: {site.site_name}</p>
		<Form
			name="update page form"
			config={updatePageConfig}
			clearOnSuccess={false}
			triggerUpdate={updatePageFormHandler}
		/>
		<a class="btn" href="/app/sites/{site.id}">Go back</a>
	</div>
</section>
