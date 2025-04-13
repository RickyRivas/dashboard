<script lang="ts">
	import type { CodeAsset } from '$lib/types';

	// imports
	import { onMount } from 'svelte';

	// highlighting & formatting
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';

	let { codeAsset }: { codeAsset: CodeAsset } = $props();
	let copyBtn: HTMLButtonElement;

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

	const codeToDisplay = {
		html: codeAsset.html || '',
		css: codeAsset.css || '',
		javascript: codeAsset.javascript || ''
	};

	const beautifyFunctions = {
		html: beautify.html,
		css: beautify.css,
		js: beautify.javascript
	};

	const prismLanguages = {
		html: Prism.languages.markup,
		css: Prism.languages.css,
		js: Prism.languages.javascript
	};

	let formattedCode = $state();
	let activeIndex = $state() as number;
	let selectedTech = $state(Object.entries(codeToDisplay)[0]);

	function formatAndHighlightCode(index: number, code: string, tech: 'html' | 'css' | 'js') {
		activeIndex = index;

		const beautifyFunction = beautifyFunctions[tech] || ((x) => x);
		const language = prismLanguages[tech] || Prism.languages.markup;

		selectedTech = Object.entries(codeToDisplay)[index];

		if (!code) {
			formattedCode = `<pre>${tech} snippet not included.</pre>`;
		} else {
			formattedCode = Prism.highlight(beautifyFunction(code, formatOpts), language, tech);
		}
	}

	function copy() {
		const beautifyFunction = beautifyFunctions[selectedTech[0]] || ((x) => x);
		navigator.clipboard.writeText(beautifyFunction(selectedTech[1], formatOpts));
		copyBtn.classList.add('success');
		console.log('copied!');

		setTimeout(() => {
			copyBtn.classList.remove('success');
		}, 1000);
	}

	onMount(() => {
		// find first available tech and set that as active tab
		let i = 0;
		for (const [lang, code] of Object.entries(codeToDisplay)) {
			if (code) formatAndHighlightCode(i, codeToDisplay[lang], lang);
			i++;
		}
	});
</script>

<div class="code-display-container">
	<div class="panel">
		<button class="btn" onclick={copy} bind:this={copyBtn}>Copy {selectedTech[0]}</button>

		<div class="tabs">
			{#each Object.entries(codeToDisplay) as [tech, snippet], i}
				<button
					class="btn"
					onclick={() => formatAndHighlightCode(i, snippet, tech)}
					class:viewing={i === activeIndex}
					disabled={i === activeIndex || !snippet}
				>
					{tech}
				</button>
			{/each}
		</div>
	</div>
	<div class="code">
		<pre>{@html formattedCode}</pre>
	</div>
	<a href="/app/manager?code_asset_id={codeAsset.id}" class="btn">Edit</a>
</div>

<style lang="less">
	.code-display-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		.panel {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.tabs {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 1em;

			button {
				text-transform: capitalize;
			}
			button.viewing {
				outline: 3px solid var(--primary);
			}
		}
		.code {
			background-color: #212121;
			padding: 1em;
			font-size: 16px;
			border: 1px solid var(--border-color);
			color: #fff;
			border: none;
			border-radius: 0px;
			height: 300px;
			overflow: auto;
		}
	}
</style>
