<script lang="ts">
	// imports
	import type { CodeAsset } from '$lib/types';

	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';

	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { oneDark } from '@codemirror/theme-one-dark';

	let props: CodeMirror['$$prop_def'] = $state({
		basic: true,
		useTab: true,
		editable: false,
		lineWrapping: false,
		readonly: false,
		tabSize: 2,
		placeholder: null,
		lang: html(),
		theme: null,
		nodebounce: false
	});

	const formatOpts = {
		inline: [''],
		wrap_line_length: 100,
		indent_size: 2,
		preserve_newlines: true,
		indent_inner_html: true,
		// Ensure HTML comments and images are on new lines
		unformatted: [''],
		content_unformatted: ['']
	};

	let { codeAsset }: { codeAsset: CodeAsset } = $props();
	let copyBtn: HTMLButtonElement;

	// editor
	let typingValue = $state(beautify.html(codeAsset.html, formatOpts));
	let values = $state({
		html: beautify.html(codeAsset.html, formatOpts),
		css: beautify.css(codeAsset.css, formatOpts),
		javascript: beautify(codeAsset.javascript, formatOpts)
	});

	const languages = ['html', 'css', 'javascript'];
	let language = $state('html');

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

	let success = $state(false);

	function copy() {
		navigator.clipboard.writeText(typingValue);
		success = true;

		setTimeout(() => {
			success = false;
		}, 1000);
	}
</script>

<div class="code-display-container">
	<button class="btn" onclick={copy} class:success>Copy {language.toUpperCase()}</button>
	<div class="tabs">
		{#each languages as lang}
			<button
				class="btn"
				type="button"
				class:active={language === lang}
				onclick={() => {
					language = lang;
					on_language_change(lang);
				}}
			>
				{lang.toUpperCase()}
			</button>
		{/each}
	</div>
	<div class="form-control">
		<CodeMirror
			bind:value={typingValue}
			on:change={(e) => {
				values[language] = e.detail;
			}}
			class="manager-code-editor"
			{...props}
		/>
	</div>
</div>

<style lang="less">
	.code-display-container {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 1em;

		.tabs {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 1em;
		}
	}
</style>
