<script lang="ts">
	import AuthForm from '$lib/components/form/AuthForm.svelte';
	import { registerFormConfig } from '$lib/form-configs';
	let inputConfigs = $state(registerFormConfig);
</script>

<h1>Register a new account</h1>
<AuthForm
	action="?/register"
	submitButtonText="Register"
	bind:inputConfigs
	footerContent="<p>Already have an account? <a href='/login'>log in</a></p>"
/>
