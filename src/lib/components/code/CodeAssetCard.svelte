<script lang="ts">
	import type { CodeAsset } from '$lib/types';
	import CopyButton from './CopyButton.svelte';
	let {
		codeAsset,
		onViewSnippet
	}: { codeAsset: CodeAsset; onViewSnippet: (codeAsset: CodeAsset) => void } = $props();

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

	const data = extractData(codeAsset);
</script>

<li class="codeAsset-card">
	<span>{codeAsset.title}</span>
	<button class="btn" onclick={() => onViewSnippet(codeAsset)}>View</button>
	<CopyButton snippet={data!.value} lang={data!.lang} text="Copy" />
</li>
