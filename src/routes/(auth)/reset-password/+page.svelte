<script lang="ts">
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import { resetPasswordFormConfig } from '$lib/form-configs';
	let inputConfigs = $state(resetPasswordFormConfig);
</script>

<h1>Please reset your password below.</h1>
<AuthForm action="?/resetPassword" submitButtonText="Update Password" bind:inputConfigs />
