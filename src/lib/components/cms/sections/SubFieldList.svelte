<script lang="ts">
	import Field from './Field.svelte';
	let { id }: { id: number } = $props();

	type field = {
		name: string;
		id: number;
	};

	let subFields: field[] = $state([]);

	const dynamicFieldsMax = 10;

	const deleteSubField = (field: field): void => {
		subFields = subFields.filter((field) => field !== field);
	};

	const addSubField = (): void => {
		if (subFields.length === dynamicFieldsMax) return;
		const maxId = subFields.length > 0 ? Math.max(...subFields.map((field) => field.id)) : -1;
		const newField: field = { name: '', id: maxId + 1 };
		subFields = [...subFields, newField];
	};
</script>

{#if subFields.length}
	<div class="sub-fields">
		{#each subFields as subField (subField.id)}
			<Field id={subField.id} />
		{/each}
	</div>
{/if}

<button class="btn" type="button" onclick={addSubField}>Add Sub Field</button>
