<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap, placeholder as placeholderExt } from '@codemirror/view';
	import { Compartment, EditorState, StateEffect, type Extension } from '@codemirror/state';
	import { indentWithTab } from '@codemirror/commands';
	import {
		autocompletion,
		completionKeymap,
		closeBrackets,
		closeBracketsKeymap
	} from '@codemirror/autocomplete';
	import { foldGutter, indentOnInput, bracketMatching, foldKeymap } from '@codemirror/language';
	import { indentUnit, type LanguageSupport } from '@codemirror/language';
	import { highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
	import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
	import { javascript } from '@codemirror/lang-javascript';
	import { html } from '@codemirror/lang-html';
	import { css } from '@codemirror/lang-css';
	import { oneDark } from '@codemirror/theme-one-dark';
	type Lang = 'javascript' | 'html' | 'css';

	// formatting/highlighting
	import beautify from 'js-beautify';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import { highlightCode } from '$lib/highlight-code';

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

	//
	let editorContainer: HTMLDivElement;
	let view: EditorView | undefined = $state(undefined);
	let languageCompartment = new Compartment();
	let isUpdatingFromProp = $state(false);

	let {
		onupdatevalue,
		lang,
		doc,
		readonly = false,
		classes = []
	}: {
		onupdatevalue: (tr: string) => void;
		lang: Lang | undefined;
		doc: string;
		readonly?: boolean;
		classes?: string[];
	} = $props();

	function createEditorView() {
		const extensions: Extension[] = $state([
			basicSetup,
			languageCompartment.of(getLanguageSupport(lang) || html()),
			oneDark,
			EditorState.tabSize.of(2),
			placeholderExt(readonly ? '' : 'Enter code here...'),
			EditorView.lineWrapping,
			closeBrackets(),
			bracketMatching(),
			indentOnInput(),
			highlightActiveLine(),
			foldGutter(),
			autocompletion(),
			highlightSelectionMatches(),
			keymap.of([indentWithTab])
		]);

		if (readonly) extensions.push(EditorState.readOnly.of(readonly));

		const editorState = EditorState.create({ doc, extensions });

		return new EditorView({
			parent: editorContainer,
			state: editorState,
			dispatch(transaction, view) {
				// update editor
				view.update([transaction]);

				if (transaction.docChanged && !isUpdatingFromProp) {
					// Get the new document content from the last transaction's state
					const newValue = transaction.state.doc.toString();
					onupdatevalue(newValue);
				}
			}
		});
	}

	function getLanguageSupport(langType: Lang | undefined): LanguageSupport | undefined {
		switch (langType) {
			case 'javascript':
				return javascript();
			case 'html':
				return html();
			case 'css':
				return css();
		}
	}

	// update lang
	$effect(() => {
		if (view && lang) {
			view.dispatch({
				effects: languageCompartment.reconfigure(getLanguageSupport(lang) || html())
			});
		}
	});

	// handle doc prop changes
	$effect(() => {
		if (view && doc !== undefined && !isUpdatingFromProp) {
			const currentDoc = view.state.doc.toString();

			if (doc !== currentDoc) {
				// one time reformat, on lang change.
				// doc = beautify[lang === 'javascript' ? 'js' : lang](doc, formatOpts);

				isUpdatingFromProp = true;
				view.dispatch({
					changes: {
						from: 0,
						to: view.state.doc.length,
						insert: doc
					}
				});
			}

			setTimeout(() => {
				isUpdatingFromProp = false;
			}, 0);
		}
	});

	onMount(async () => {
		view = createEditorView();
	});

	onDestroy(() => {
		view?.destroy();
	});
</script>

<div class="block-viewer__code-editor {classes.join(' ')}" bind:this={editorContainer}></div>
