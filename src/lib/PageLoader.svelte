<script>
	import LoadingSpinner from './components/LoadingSpinner.svelte';
</script>

<div class="page-loader">
	<LoadingSpinner />
</div>

<style lang="less">
	.page-loader {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
