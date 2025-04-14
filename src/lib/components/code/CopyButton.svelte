<script lang="ts">
	// this component only takes one snippet code and land at a time
	// formatting/highlighting
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';

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
		text = 'Copy',
		minimize = true
	}: { snippet: string; lang: string; text: string; minimize: boolean } = $props();
	let copyBtn: HTMLButtonElement;
	let success = $state(false);

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
		success = true;

		setTimeout(() => {
			success = false;
		}, 1000);
	}
</script>

<button class="btn" class:success {onclick} bind:this={copyBtn} aria-label="copy code snippet">
	{text ? text : 'Copy'}
</button>

<style>
	button.minimize {
		background: none;
		padding: 0;
		transition: color 0.33s ease;

		&.success {
			color: green;
		}
	}
</style>
