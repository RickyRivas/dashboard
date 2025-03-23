<script lang="ts">
	// this component only takes one snippet code and land at a time
	// formatting/highlighting
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import type { CodeSnippetType } from '$lib/types';

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

	const {
		snippet,
		lang,
		text = 'Copy'
	}: { snippet: CodeSnippetType; lang: string; text: string } = $props();
	let copyBtn: HTMLButtonElement;

	const beautifyFunctions = {
		html: beautify.html,
		css: beautify.css,
		javascript: beautify.javascript
	};

	const prismLanguages = {
		html: Prism.languages.markup,
		css: Prism.languages.css,
		javascript: Prism.languages.javascript
	};

	function onclick() {
		const beautifyFunction = beautifyFunctions[lang] || ((x) => x);

		navigator.clipboard.writeText(beautifyFunction(snippet, formatOpts));
		copyBtn.classList.add('success');

		setTimeout(() => {
			copyBtn.classList.remove('success');
		}, 1000);
	}
</script>

<button class="btn" {onclick} bind:this={copyBtn}>{text ? text : 'Copy'}</button>
