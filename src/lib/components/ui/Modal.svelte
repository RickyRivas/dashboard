<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let modal: HTMLDivElement, modalContainer;
	let { closeModal, modalContent } = $props();

	const _focusableElementsSelector =
		'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeModal();
		else if (e.key === 'Tab') handleTabKey(e);
	}

	function handleTabKey(e: KeyboardEvent) {
		// get all focusable elements in modal
		const focusableElements = [
			...modal.querySelectorAll(_focusableElementsSelector)
		] as HTMLElement[];
		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		const focusedElement = document.activeElement;

		// Handle tab navigation
		if (e.shiftKey && focusedElement === firstElement) {
			lastElement.focus();
			e.preventDefault();
		} else if (!e.shiftKey && focusedElement === lastElement) {
			firstElement.focus();
			e.preventDefault();
		}
	}

	function handleBackdropClick() {
		closeModal();
	}

	onMount(() => {
		modal.focus();
		// Add event listener for clicks outside the modal container
		document.addEventListener('keydown', onkeydown);
	});

	onDestroy(() => {
		// Clean up event listeners
		document.removeEventListener('keydown', onkeydown);
	});
</script>

<div
	bind:this={modal}
	id="modal"
	role="dialog"
	aria-modal="true"
	aria-label="Dialog Window (Press escape to close)"
	tabindex="-1"
	aria-hidden="false"
	{onkeydown}
	transition:fade
>
	<div class="modal-backdrop" onclick={handleBackdropClick}></div>
	<div class="modal" role="document" bind:this={modalContainer}>{@render modalContent()}</div>
	<button id="close-modal" aria-label="Close (Press escape to close)" onclick={() => closeModal()}>
		<img src="/icons/close.svg" width="25" height="25" alt="close icon" />
	</button>
</div>
