<script lang="ts">
	import type { fieldType } from '$lib/types';

	let { onUpdateSelectedfieldType, id } = $props();
	let selectedfieldLabel = $state('');
	let selectedfieldKey = $state('');
	let createFieldOptions: fieldType[] = ['repeater', 'text', 'content'];
	let selectedCreatFieldOption = $state('text');
</script>

<div class="create-field__fields">
	<div class="form-control">
		<label>
			Type
			<select
				name="field-{id}-type"
				required
				bind:value={selectedCreatFieldOption}
				onchange={(e: Event) => {
					const target = e.target as HTMLInputElement;
					const newValue = target?.value as fieldType;
					onUpdateSelectedfieldType(newValue);
				}}
			>
				{#each createFieldOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="form-control">
		<label>
			Label
			<input type="text" name="field-{id}-label" bind:value={selectedfieldLabel} required />
		</label>
	</div>

	<div class="form-control">
		<label>
			Key
			<input type="text" name="field-{id}-key" bind:value={selectedfieldKey} required />
		</label>
	</div>
</div>
