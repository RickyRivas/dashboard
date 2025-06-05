<script lang="ts">
	import type { InputAttributes, LabelConfig, FieldState, TriggerUpdate } from '$lib/form-types';
	const {
		configuration
	}: {
		configuration: { inputAttributes: InputAttributes; labelConfig: LabelConfig };
	} = $props();
</script>

<div class="form-control form-control--display">
	<label>
		{configuration.labelConfig.displayFormLabel
			? configuration.labelConfig.displayFormLabel
			: configuration.labelConfig.text}
		<input type="text" readonly value={configuration.inputAttributes.value} />
	</label>
</div>
