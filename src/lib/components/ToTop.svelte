<script lang="ts">
	let y: any;
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};
</script>

<svelte:window bind:scrollY={y} />

<button id="btt" class={y >= 100 ? 'show' : 'hide'} onclick={scrollToTop} aria-label="back to top">
	<svg
		class="icon"
		aria-hidden="true"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		width="44"
		height="28"
		fill="none"
		viewBox="0 0 44 28"
	>
		<path fill="currentColor" d="M22 0 0 22l5.188 5.189L22 10.377l16.812 16.812L44 22 22 0Z" />
	</svg>
</button>

<style lang="less">
	#btt {
		position: fixed;
		bottom: 1em;
		right: 1em;
		z-index: 7777;
		background: none;
		border: none;
		border-radius: 0px;
		background-color: var(--primary);
		color: #fff;
		transition: opacity 0.33s ease-in-out;
		width: 44px;
		height: 44px;
		padding: 5px;
		border-radius: var(--border-radius);
		&.hide {
			opacity: 0;
		}
	}
</style>
