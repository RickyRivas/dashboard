<script lang="ts">
	import ErrorMessage from './ErrorMessage.svelte';

	interface Prop {
		name: string;
		label: string;
		value: string;
		type: string;
		placeholder: string;
		required: boolean;
		error: string | null;
		disabled: boolean;
		autocomplete:
			| 'off'
			| 'on'
			// Sign-in/credentials
			| 'username'
			| 'current-password'
			| 'new-password'
			// Contact
			| 'email'
			| 'tel'
			// Personal info
			| 'name'
			| 'given-name'
			| 'family-name'
			| 'nickname'
			// Address
			| 'street-address'
			| 'address-line1'
			| 'address-line2'
			| 'address-level1'
			| 'address-level2'
			| 'postal-code'
			| 'country'
			// Payment
			| 'cc-name'
			| 'cc-number'
			| 'cc-exp'
			| 'cc-exp-month'
			| 'cc-exp-year'
			| 'cc-csc'
			// One-time code
			| 'one-time-code'
			| undefined;
		id: string;
	}

	let {
		label,
		name,
		value = $bindable(),
		type = 'text',
		placeholder = '',
		required = false,
		error = $bindable(null),
		disabled = $bindable(false),
		autocomplete = undefined,
		id = `input-${Math.random().toString(36).substr(2, 9)}`
	}: Prop = $props();

	// Reference to the input element
	let inputElement: HTMLInputElement;

	// Handle input changes
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
	}
</script>

<div class="form-control">
	{#if label}
		<label for={id} class:required>
			{label}
		</label>
	{/if}
	<input
		{id}
		{type}
		{name}
		{placeholder}
		{required}
		{disabled}
		{value}
		{autocomplete}
		bind:this={inputElement}
		class:error
		oninput={handleInput}
	/>
	{#if error}
		<ErrorMessage errorMessage={error} />
	{/if}
</div>
