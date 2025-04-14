<script lang="ts">
	import { enhance } from '$app/forms';
	import FormInput from '$lib/components/form/FormInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { handleAPIErrorsForm, type InputConfig } from '$lib/form-helpers';
	import type { PageProps } from './$types';

	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { oneDark } from '@codemirror/theme-one-dark';

	let inputConfigs: InputConfig[] = $state([
		{
			name: 'title',
			label: 'Title*',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Title',
			disabled: false,
			error: ''
		},
		{
			name: 'description',
			label: 'Description*',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Description',
			disabled: true,
			error: ''
		},
		{
			name: 'type',
			label: 'Type',
			type: 'radio',
			options: ['snippet', 'component', 'section'],
			value: '',
			required: true,
			placeholder: 'Type',
			disabled: true,
			error: ''
		},
		{
			name: 'category',
			label: 'Category*',
			type: 'text',
			value: '',
			required: true,
			placeholder: 'Category',
			disabled: true,
			error: ''
		},
		{
			name: 'thumbnailurl',
			label: 'Thumbnail Url',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Thumbnail Url',
			disabled: true,
			error: '',
			cloudinary: true
		},
		{
			name: 'buildtime',
			label: 'Build Time',
			type: 'text',
			value: '',
			required: false,
			placeholder: 'Build Time',
			disabled: false,
			error: ''
		},
		{
			name: 'favorite',
			label: 'Favorite',
			type: 'checkbox',
			value: false,
			required: false,
			placeholder: '',
			disabled: true,
			error: ''
		}
	]);

	let props: CodeMirror['$$prop_def'] = $state({
		basic: true,
		useTab: true,
		editable: true,
		lineWrapping: false,
		readonly: false,
		tabSize: 2,
		placeholder: null,
		lang: html(),
		theme: null,
		nodebounce: false
	});

	// if editing code asset
	let { data }: PageProps = $props();
	let editingCodeAsset = $state(false);
	let createdAt = $state('');
	let updatedAt = $state('');
	const { codeAsset } = data;

	if (codeAsset) editingCodeAsset = true;

	// editor
	let typingValue = $state(editingCodeAsset ? codeAsset.html : '');
	let values = $state({
		html: editingCodeAsset ? codeAsset.html : '',
		css: editingCodeAsset ? codeAsset.css : '',
		javascript: editingCodeAsset ? codeAsset.javascript : ''
	});

	if (codeAsset) {
		// input configs
		for (const [key, value] of Object.entries(data.codeAsset)) {
			const formInput = inputConfigs.find((i) => i.name === key);
			if (formInput) formInput.value = value;
		}
	}

	const languages = ['html', 'css', 'javascript'];
	let language = $state('html');

	const themes = ['default', 'onedark'];
	let theme = 'default';

	function on_language_change(language): void {
		switch (language) {
			case 'html':
				props.lang = html({ matchClosingTags: true });
				typingValue = values.html;
				break;
			case 'css':
				props.lang = css();
				typingValue = values.css;
				break;
			case 'javascript':
				props.lang = javascript();
				typingValue = values.javascript;
				break;
		}
	}

	function on_theme_change(): void {
		switch (theme) {
			case 'default':
				props.theme = null;
				break;
			case 'onedark':
				props.theme = oneDark;
				break;
		}
	}

	// form ui state
	let loading = $state(false);
	let error = $state(false);
	let success = $state(false);
	let managerForm;

	// delete form ui state
	let deleteFormLoading = $state(false);
	let deleteFormError = $state(false);
	let deleteFormSuccess = $state(false);
	let deleteForm;
</script>

<section>
	<div class="container">
		<h1>Library Manager {editingCodeAsset ? '- editing mode' : ''}</h1>

		<form
			method="post"
			class="default-styling"
			action="?/addToManager"
			bind:this={managerForm}
			use:enhance={() => {
				loading = true;
				success = false;
				error = false;
				inputConfigs.forEach((config) => {
					config.error = '';
				});

				return async ({ result }) => {
					if (result.type === 'success') {
						success = true;
						error = false;

						if (result.data) {
							// show success/error state for a 1s
							setTimeout(() => {
								if (result?.data?.redirectTo) {
									window.location = result.data.redirectTo;
								}

								loading = false;
							}, 1000);
						}
					} else {
						error = true;
						success = false;

						if (result.data.errors) {
							inputConfigs = handleAPIErrorsForm(inputConfigs, result.data.errors);
						}

						setTimeout(() => {
							loading = false;
						}, 1000);
					}
				};
			}}
		>
			{#each inputConfigs as { name, label, placeholder, required, disabled, type, oAuthOnly, options, cloudinary }, i}
				<FormInput
					id={name}
					{name}
					{label}
					{placeholder}
					{required}
					{type}
					{options}
					{cloudinary}
					bind:value={inputConfigs[i].value}
					bind:disabled={loading}
					bind:error={inputConfigs[i].error}
					autocomplete="off"
				/>
			{/each}

			<!--  Code Editor -->
			<div class="form-control">
				<div class="manager-editor-lang-btns">
					<fieldset>
						<legend>Code*</legend>
						{#each languages as lang}
							<input type="hidden" name={lang} value={values[lang]} />
							<button
								class="btn"
								type="button"
								class:active={language === lang}
								onclick={() => {
									language = lang;
									on_language_change(lang);
								}}
							>
								{lang}
							</button>
						{/each}
					</fieldset>
				</div>
				<CodeMirror
					bind:value={typingValue}
					on:change={(e) => {
						values[language] = e.detail;
					}}
					class="manager-code-editor"
					{...props}
				/>
			</div>

			{#if editingCodeAsset}
				<input type="hidden" name="code-asset-id" value={codeAsset.id} />
			{/if}

			<button class="btn" disabled={loading}>
				{#if loading}
					<LoadingSpinner bind:loading bind:error bind:success dim={44} />
				{:else}
					<span>Save</span>
				{/if}
			</button>
		</form>

		{#if editingCodeAsset}
			{#if createdAt}
				<p>Code asset created: {createdAt}</p>
			{/if}
			{#if updatedAt}
				<p>Last updated: {updatedAt}</p>
			{/if}

			<form
				method="post"
				action="?/delete"
				bind:this={managerForm}
				use:enhance={() => {
					deleteFormLoading = true;
					deleteFormSuccess = false;
					deleteFormError = false;

					return async ({ result }) => {
						if (result.type === 'success') {
							deleteFormSuccess = true;
							deleteFormError = false;

							if (result.data) {
								setTimeout(() => {
									if (result?.data?.redirectTo) {
										window.location = result.data.redirectTo;
									}

									deleteFormLoading = false;
								}, 1000);
							}
						} else {
							deleteFormError = true;
							deleteFormSuccess = false;

							setTimeout(() => {
								deleteFormLoading = false;
							}, 1000);
						}
					};
				}}
			>
				<input type="hidden" name="type" value={codeAsset.type} />
				<input type="hidden" name="category" value={codeAsset.category} />
				<input type="hidden" name="code-asset-id" value={codeAsset.id} />
				<button class="btn error" disabled={deleteFormLoading}>
					{#if deleteFormLoading}
						<LoadingSpinner
							bind:loading={deleteFormLoading}
							bind:error={deleteFormError}
							bind:success={deleteFormSuccess}
							dim={44}
						/>
					{:else}
						<span>Delete Code Asset</span>
					{/if}
				</button>
			</form>
		{/if}
	</div>
</section>
