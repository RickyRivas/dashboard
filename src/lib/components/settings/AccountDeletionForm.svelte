<script lang="ts">
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import { deleteAccountFormConfig } from '$lib/form-configs';
	let deleteInputConfigs = $state(deleteAccountFormConfig);
	let showDeleteAccountForm = $state(false);
</script>

{#if showDeleteAccountForm}
	<AuthForm
		action="?/deleteAccount"
		submitButtonText="Delete Account"
		bind:inputConfigs={deleteInputConfigs}
	/>
	<button class="btn" onclick={() => (showDeleteAccountForm = false)}>Cancel</button>
{:else}
	<button class="btn" onclick={() => (showDeleteAccountForm = !showDeleteAccountForm)}>
		Delete Account
	</button>
{/if}
