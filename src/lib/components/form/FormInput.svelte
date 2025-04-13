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
		options?: string[];
		oauthUserDisable?: boolean;
		autocomplete?:
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
		options = [],
		error = $bindable(null),
		disabled = $bindable(false),
		autocomplete = undefined,
		oauthUserDisable = false,
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
	<!-- radio/checkboxes -->
	{#if type === 'radio'}
		<fieldset>
			<legend>{label}{required ? '*' : ''}</legend>
			<div class="form-radio-group">
				{#each options as option}
					<label>
						<input
							type="radio"
							{name}
							bind:group={value}
							value={option}
							onchange={(e) => {
								value = e.target.value;
							}}
						/>
						{option}
					</label>
				{/each}
			</div>
		</fieldset>
	{:else if type === 'checkbox'}
		<label>
			{label}{required ? '*' : ''}
			<input type="checkbox" {name} bind:checked={value} />
		</label>
	{:else}
		<!-- everything else -->
		{#if label}
			<label for={id} class:required>
				{label}
				{oauthUserDisable ? '- Change Email through your provider.' : ''}
			</label>
		{/if}

		<!-- oauthUserDisable is for fields that users signed in with a provider cant change. -->
		{#if oauthUserDisable}
			<input
				{id}
				{type}
				{name}
				{placeholder}
				{required}
				disabled={true}
				{value}
				{autocomplete}
				bind:this={inputElement}
				class:error
			/>
		{:else}
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
		{/if}
	{/if}

	{#if error}
		<ErrorMessage errorMessage={error} />
	{/if}
</div>
