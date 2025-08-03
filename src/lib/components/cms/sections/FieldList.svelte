<script lang="ts">
	import Field from './Field.svelte';

	type field = {
		name: string;
		id: number;
	};

	let fields: field[] = $state([]);

	const dynamicFieldsMax = 10;

	const deleteField = (field: field): void => {
		fields = fields.filter((field) => field !== field);
	};

	const addField = (): void => {
		if (fields.length === dynamicFieldsMax) return;
		const maxId = fields.length > 0 ? Math.max(...fields.map((field) => field.id)) : -1;
		const newField: field = { name: '', id: maxId + 1 };
		fields = [...fields, newField];
	};
</script>

{#if fields.length}
	<div class="create-fields">
		{#each fields as field (field.id)}
			<Field id={field.id} />
		{/each}
	</div>
{/if}

<button class="btn" type="button" onclick={addField}>Add Field</button>
