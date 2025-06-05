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
		<input type="hidden" readonly value={configuration.inputAttributes.value} />
	</label>
	<div>
		<div class="small-avatar">
			<img
				alt="avatar placeholder"
				width="40"
				height="40"
				src={configuration.inputAttributes.value.toString()}
			/>
		</div>
	</div>
</div>
