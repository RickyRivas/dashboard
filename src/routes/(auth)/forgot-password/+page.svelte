<script lang="ts">
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import { forgotPasswordFormConfig } from '$lib/form-configs';
	let inputConfigs = $state(forgotPasswordFormConfig);
</script>

<h1>Forgot password</h1>
<AuthForm
	action="?/passwordResetRequest"
	submitButtonText="Send Password Reset Link"
	bind:inputConfigs
	footerContent="<p>Take me back to <a href='/login'>Login</a>.</p>"
/>
