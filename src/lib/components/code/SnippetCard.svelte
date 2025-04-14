<script lang="ts">
	import type { CodeAsset } from '$lib/types';
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import ToggleFavorite from './ToggleFavorite.svelte';

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

	let formattedCode = $state();
	let success = $state(false);

	function formatAndHighlightCode(code: string, tech: 'html' | 'css' | 'javascript') {
		const beautifyFunction = beautifyFunctions[tech] || ((x) => x);
		const language = prismLanguages[tech] || Prism.languages.markup;

		if (!code) {
			formattedCode = `<pre>${tech} snippet not included.</pre>`;
		} else {
			formattedCode = Prism.highlight(beautifyFunction(code, formatOpts), language, tech);
		}
	}

	let { codeAsset }: { codeAsset: CodeAsset } = $props();

	function extractData(codeAsset: CodeAsset) {
		for (const lang of ['html', 'css', 'javascript']) {
			if (codeAsset[lang] && codeAsset[lang].trim !== '') {
				return {
					lang,
					value: codeAsset[lang]
				};
			}
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	function copy() {
		const beautifyFunction = beautifyFunctions[availableLanguage?.lang] || ((x) => x);
		navigator.clipboard.writeText(beautifyFunction(availableLanguage?.value, formatOpts));
		success = true;

		setTimeout(() => {
			success = false;
		}, 1000);
	}

	const availableLanguage = extractData(codeAsset);
	formatAndHighlightCode(availableLanguage?.value, availableLanguage?.lang);
	let active = $state(false);
</script>

<li class="snippet-card" class:favorite={codeAsset.favorite}>
	<div class="header">
		<h3>{codeAsset.title}</h3>
		<p>{codeAsset.description || 'No description.'}</p>
	</div>
	<div class="display-code">
		<button
			class="code-btn"
			class:active
			onclick={() => {
				active = !active;
			}}
		>
			<pre>{@html formattedCode}</pre>
		</button>
		<div class="btns">
			<ToggleFavorite id={codeAsset.id} favorite={codeAsset.favorite} dim={24} />
			<a href="/app/manager?code_asset_id={codeAsset.id}" class="btn" aria-label="edit snippet">
				<svg
					aria-hidden="true"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					width="44"
					height="44"
					fill="none"
					viewBox="0 0 44 44"
				>
					<path
						fill="currentColor"
						d="M40.95 1.426a4.858 4.858 0 0 0-6.877 0l-2.614 2.605 8.501 8.501 2.614-2.614a4.858 4.858 0 0 0 0-6.877L40.95 1.426ZM14.97 20.53a4.79 4.79 0 0 0-1.172 1.902l-2.57 7.71a2.095 2.095 0 0 0 .503 2.137c.556.564 1.38.755 2.136.503l7.71-2.57a4.923 4.923 0 0 0 1.902-1.172l14.527-14.536-8.51-8.51L14.97 20.53ZM8.336 5.1A8.338 8.338 0 0 0 0 13.435v22.23A8.338 8.338 0 0 0 8.336 44h22.229a8.338 8.338 0 0 0 8.336-8.336v-8.336a2.776 2.776 0 0 0-2.779-2.778 2.776 2.776 0 0 0-2.779 2.778v8.336a2.776 2.776 0 0 1-2.778 2.779H8.335a2.776 2.776 0 0 1-2.778-2.779V13.435a2.776 2.776 0 0 1 2.779-2.779h8.336a2.776 2.776 0 0 0 2.778-2.778 2.776 2.776 0 0 0-2.778-2.779H8.336Z"
					/>
				</svg>
			</a>
			<button class="btn copy-btn" class:success onclick={copy} aria-label="copy code snippet">
				<svg
					aria-hidden="true"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					width="44"
					height="44"
					fill="none"
					viewBox="0 0 44 44"
				>
					<path
						fill="currentColor"
						d="M20.625 0H31.29c1.091 0 2.14.438 2.913 1.212l5.835 5.835A4.125 4.125 0 0 1 41.25 9.96v18.915A4.126 4.126 0 0 1 37.125 33h-16.5a4.126 4.126 0 0 1-4.125-4.125V4.125A4.126 4.126 0 0 1 20.625 0ZM6.875 11h6.875v5.5h-5.5v22h16.5v-2.75h5.5v4.125A4.126 4.126 0 0 1 26.125 44H6.875a4.126 4.126 0 0 1-4.125-4.125v-24.75A4.126 4.126 0 0 1 6.875 11Z"
					/>
				</svg>
			</button>
		</div>
	</div>
	<div class="footer">
		<span>{availableLanguage?.lang}</span>
		<span>{formatDate(codeAsset.updated_at)}</span>
	</div>
	<!-- <button class="btn" onclick={() => onViewSnippet(codeAsset)}>View</button> -->
</li>
