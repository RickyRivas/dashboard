<script lang="ts">
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import { loginFormConfig } from '$lib/form-configs';
	let inputConfigs = $state(loginFormConfig);
</script>

<h1>Sign in</h1>
<AuthForm
	submitButtonText="Sign In"
	action="?/login"
	bind:inputConfigs
	showRememberMe={true}
	oAuth={true}
	footerContent="<p>Don't have an account? <a href='/register'>Register</a> <br> <a href='/forgot-password'>Forgot password?</a></p>"
/>
