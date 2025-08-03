<script lang="ts">
	let { id, sub = false }: { id: number; sub?: boolean } = $props();

	let value = $state('');
</script>

<div class="form-control">
	<label>
		Text Entry Value
		<input type="text" name="field-{id}-value" bind:value />
	</label>
</div>
