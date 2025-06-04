<script lang="ts">
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import type { PageProps } from './$types';
	import { managerFormConfig } from '$lib/forms/manager-form';
	import Form from '$lib/components/form/Form.svelte';
	import { deleteAssetConfig } from '$lib/forms/manager-delete-asset';
	import moment from 'moment';

	const { data }: PageProps = $props();

	// forms
	let managerConfig = $state(managerFormConfig);
	const manageFormHandler = handleTriggerUpdate(managerConfig);

	let deleteConfig = $state(deleteAssetConfig);
	const deleteAssetFormHandler = handleTriggerUpdate(deleteConfig);

	// editing code asset
	if (data.codeAsset) {
		updateConfigWithValues(managerConfig, data.codeAsset);
		updateConfigWithValues(deleteConfig, data.codeAsset);
	}
</script>

<section>
	<div class="container">
		<h1>Library Manager - <span style:color={'red'}>edit mode</span></h1>

		<Form name="manager form" config={managerConfig} triggerUpdate={manageFormHandler} />

		{#if data.codeAsset}
			{#if data.codeAsset.created_at}
				<p>
					Created at {moment(data.codeAsset.created_at).format('MMMM Do YYYY, h:mma')}
				</p>
			{/if}
			{#if data.codeAsset.updated_at}
				<p>
					Last updated at {moment(data.codeAsset.updated_at).format('MMMM Do YYYY, h:mma')}
				</p>
			{/if}
			<Form
				name="delete asset form"
				classes={['']}
				config={deleteConfig}
				triggerUpdate={deleteAssetFormHandler}
			/>
		{/if}
	</div>
</section>
