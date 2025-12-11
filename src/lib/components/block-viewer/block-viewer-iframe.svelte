<script lang="ts">
	import { generateLibraryTags } from '$lib/utils/libraries/index';
	import less from 'less';
	import { onMount } from 'svelte';
	import { lessMixins, lessBase } from './definitions';

	let { asset } = $props();
	let compiledCss = $state('');
	let previewDoc = $state('');
	let compileError = $state(false);
	let containerDiv: HTMLDivElement;
	let iframe: HTMLIFrameElement;

	// Compile LESS to CSS
	async function compileLess(lessCode: string) {
		if (!lessCode) return '';

		const fullLessCode = `${lessBase}\n${lessMixins}\n${lessCode}`;

		const result = await less.render(fullLessCode, {
			math: 'always'
		});

		return result;
	}

	function createErrorDoc(errorMessage) {
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		</head>
		<body>
		<h1 style="color: red; font-size: 14px;">${errorMessage || 'Error compiling LESS code.'}</h1>
		</body>
		</html>`;
	}

	// Create and append iframe to container
	function createIframe() {
		// Remove existing iframe if present
		if (iframe) {
			iframe.remove();
		}

		// Create new iframe
		iframe = document.createElement('iframe');
		iframe.title = asset.title || 'preview';
		iframe.sandbox.add('allow-scripts');
		iframe.className = 'asset-preview';

		if (compileError) {
			iframe.classList.add('asset-preview--error');
		}

		// Append to container
		if (containerDiv) {
			containerDiv.appendChild(iframe);
		}
	}

	// Update preview whenever asset changes
	async function updatePreview() {
		try {
			let checkLESSCode = await compileLess(asset.css);
			compiledCss = checkLESSCode.css;

			previewDoc = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { 
        margin: 0; 
        padding: 1rem; 
        font-family: system-ui, -apple-system, sans-serif;
      }
      ${compiledCss}
    </style>
    ${generateLibraryTags(asset.libraries)}
  </head>
  <body>
  <div class="centered-container">
    ${asset.html || ''}
	</div>
    ${
			asset.javascript
				? `
    <script>
      // Wait for libraries to load
      window.addEventListener('DOMContentLoaded', () => {
        ${asset.javascript}
      });
    <\/script>`
				: ''
		}
  </body>
</html>`;
			compileError = false;
		} catch (e) {
			previewDoc = createErrorDoc(e.message);
			compileError = true;
		}

		// Create iframe and set srcdoc
		createIframe();
		if (iframe) {
			iframe.srcdoc = previewDoc;
		}
	}

	// Compile on mount and whenever asset changes
	onMount(() => {
		updatePreview();
	});

	$effect(() => {
		updatePreview();
	});
</script>

<div bind:this={containerDiv} class="iframe-container"></div>
