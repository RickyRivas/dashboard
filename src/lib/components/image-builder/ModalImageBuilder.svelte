<script lang="ts">
	import CopyButton from '../code/CopyButton.svelte';
	import Prism from 'prismjs';
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';

	const { img } = $props();

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
		src: img.markupSrc,
		alt: '',
		width: img?.dimensions?.width || 0,
		height: img?.dimensions?.height || 0,
		id: '',
		className: '',
		lazyload: true,
		decoding: true,
		fetchpriority: 'high'
	});

	let imageString = $state('<img/>');
	let imageStringFormattedHighlighted = $state('<img/>');

	const idSuggestions = ['spot'];
	const classNamesSuggestions = ['decoration'];
	const altSuggestions = ['Portrait of'];

	idSuggestions.push(img.name);
	classNamesSuggestions.push(img.name);
	altSuggestions.push(img.name);

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
		{#each idSuggestions as name}
			<button class="btn" disabled={imgConfig.id === name} onclick={() => (imgConfig.id = name)}
				>{name}</button
			>
		{/each}
		<button class="btn" disabled={imgConfig.id === ''} onclick={() => (imgConfig.id = '')}
			>Clear</button
		>
	</div>
	<div class="form-control">
		<label>
			Class
			<input type="text" name="" id="" bind:value={imgConfig.className} />
		</label>
		{#each classNamesSuggestions as name}
			<button
				class="btn"
				disabled={imgConfig.className === name}
				onclick={() => (imgConfig.className = name)}>{name}</button
			>
		{/each}
		<button
			class="btn"
			disabled={imgConfig.className === ''}
			onclick={() => (imgConfig.className = '')}>Clear</button
		>
	</div>
	<div class="form-control">
		<label>
			Alt
			<input type="text" name="" bind:value={imgConfig.alt} />
		</label>
		{#each altSuggestions as name}
			<button class="btn" disabled={imgConfig.alt === name} onclick={() => (imgConfig.alt = name)}
				>{name}</button
			>
		{/each}
		<button class="btn" disabled={imgConfig.alt === ''} onclick={() => (imgConfig.alt = '')}
			>Clear</button
		>
	</div>
	<div class="form-control">
		<label>
			<input type="checkbox" bind:checked={imgConfig.lazyload} />
			lazyload?
		</label>
		<label>
			<input type="checkbox" bind:checked={imgConfig.decoding} />
			decoding?
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
