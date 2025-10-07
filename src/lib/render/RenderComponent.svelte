<script lang="ts">
	import { onMount } from 'svelte';
	import less from 'less';
	import { lessBase, lessMixins } from './definitions';
	import { browser } from '$app/environment';

	let { code } = $props();
	// console.log(code);

	let iframeContainer = $state() as HTMLDivElement;
	let html = code.html;
	let css = code.css;
	let js = code.javascript;

	let concatCss = lessMixins + ' ' + lessBase + '' + css;

	async function createAndSetIframe() {
		if (!browser) return;

		const iframe = document.createElement('iframe');
		iframe.src = '/render-component-base.html';
		iframe.title = 'preview';

		iframeContainer.appendChild(iframe);

		iframe.addEventListener('load', async () => {
			const iframeDocument = iframe.contentDocument as HTMLDocument;
			const iframeBaseStylesheet = iframeDocument.querySelector('#base-styles');
			const iframeInjectedStylesheet = iframeDocument.querySelector('#injected-styles');
			const iframeSection = iframeDocument.body.querySelector(
				'section#render-component'
			) as HTMLDivElement;

			if (html) {
				iframeSection.innerHTML = html;
			}

			if (css) {
				let compiledCss = await less.render(concatCss, {
					math: 'always' // or 'parens-division'
				});

				iframeInjectedStylesheet!.innerHTML = compiledCss.css;
			}
		});
	}

	onMount(() => {
		createAndSetIframe();
	});
</script>

<div class="render-iframe-container" bind:this={iframeContainer}></div>
