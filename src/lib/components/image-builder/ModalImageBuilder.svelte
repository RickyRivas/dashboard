<script lang="ts">
	import type { FileItem } from '$lib/types';
	import { buildTrackerState } from '$lib/tracker-state.svelte';
	import CopyButton from '../code/CopyButton.svelte';
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';

	const { img }: { img: FileItem } = $props();

	const formatOpts = {
		inline: [''],
		wrap_line_length: 50,
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
		js: beautify.javascript
	};

	const prismLanguages = {
		html: Prism.languages.markup,
		css: Prism.languages.css,
		js: Prism.languages.javascript
	};

	const imgConfig = $state({
		src: img.relativePath.replace(`/${buildTrackerState.buildTracker.account}/www`, '') || '',
		alt: '',
		width: img.fileWidth,
		height: img.fileHeight,
		id: '',
		className: '',
		lazyload: true,
		decoding: true,
		fetchpriority: 'high'
	});

	let imageString = $state('<img/>');
	let imageStringFormattedHighlighted = $state('<img/>');

	function generateImgString() {
		let attributes = [
			imgConfig.id && `id="${imgConfig.id}"`,
			imgConfig.className && `class="${imgConfig.className}"`,
			`src="${imgConfig.src}"`,
			`alt="${imgConfig.alt}"`,
			imgConfig.width && `width="${imgConfig.width}"`,
			imgConfig.height && `height="${imgConfig.height}"`,
			imgConfig.lazyload && `loading="lazy"`,
			imgConfig.decoding && `decoding="async"`
		]
			.filter(Boolean)
			.join(' ');

		return `<img ${attributes}>`;
	}

	function formatAndHighlightCode(code: string, tech: 'html' | 'css' | 'js') {
		const beautifyFunction = beautifyFunctions[tech] || ((x) => x);
		const language = prismLanguages[tech] || Prism.languages.markup;
		return Prism.highlight(beautifyFunction(code, formatOpts), language, tech);
	}

	$effect(() => {
		imageString = generateImgString();
		imageStringFormattedHighlighted = formatAndHighlightCode(generateImgString(), 'html');
	});
</script>

<div class="image-builder-container">
	<h2>Image Markup Generator</h2>
	<pre class="image-string">{@html imageStringFormattedHighlighted}</pre>
	<div class="form-control">
		<label>
			Id
			<input type="text" name="" id="" bind:value={imgConfig.id} />
		</label>
	</div>
	<div class="form-control">
		<label>
			Class
			<input type="text" name="" id="" bind:value={imgConfig.className} />
		</label>
	</div>
	<div class="form-control">
		<label>
			Alt
			<input type="text" name="" bind:value={imgConfig.alt} />
		</label>
	</div>
	<div class="form-control">
		<label>
			lazyload?
			<input type="checkbox" bind:checked={imgConfig.lazyload} />
		</label>
	</div>
	<div class="form-control">
		<label>
			decoding?
			<input type="checkbox" bind:checked={imgConfig.decoding} />
		</label>
	</div>
	<div class="btns">
		<CopyButton snippet={imgConfig.src} lang="html" text="Copy SRC" />
		<CopyButton snippet={`${imgConfig.width}`} lang="html" text="Copy WIDTH" />
		<CopyButton snippet={`${imgConfig.height}`} lang="html" text="Copy HEIGHT" />
		<CopyButton snippet={imageString} lang="html" text="Copy Generated Markup 🤖" />
	</div>
</div>

<style>
	.image-builder-container {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 1em;
	}

	.btns {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1em;
	}

	.image-string {
		text-align: center;
		font-size: 16px;
	}
</style>
