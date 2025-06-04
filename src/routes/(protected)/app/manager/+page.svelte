<script lang="ts">
	import { handleTriggerUpdate, updateConfigWithValues } from '$lib/form-helpers';
	import type { PageProps } from './$types';
	import { managerFormConfig } from '$lib/form-configs/app/manager';
	import Form from '$lib/components/form/Form.svelte';
	import { deleteAssetConfig } from '$lib/form-configs/app/manager-delete-asset';
	import moment from 'moment';

	const { data }: PageProps = $props();

	// forms
	let managerConfig = $state(managerFormConfig);
	const manageFormHandler = handleTriggerUpdate(managerConfig);

	let deleteConfig = $state(deleteAssetConfig);
	const deleteAssetFormHandler = handleTriggerUpdate(deleteConfig);

	// editing code asset
	if (data.codeAsset) {
		// create a new input and add to manager config.
		// needed for editing existing assets
		const newFieldDefinition = {
			configuration: {
				inputAttributes: {
					name: 'code-asset-id',
					type: 'hidden',
					required: true,
					disabled: false,
					placeholder: '',
					value: data.codeAsset.id
				},
				labelConfig: {
					text: 'code asset id'
				}
			},
			fieldState: {
				hasError: false,
				showSuccess: false,
				statusMessage: ''
			}
		};
		managerConfig.fieldDefinitions.push(newFieldDefinition);
		// update form values
		updateConfigWithValues(managerConfig, data.codeAsset);
		updateConfigWithValues(deleteConfig, data.codeAsset);
	}
</script>

<section>
	<div class="container">
		<h1>
			Library Manager
			{#if data.codeAsset}
				- <span style:color={'red'}>edit mode</span>
			{/if}
		</h1>

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
