<script lang="ts">
	import { appAvailableProviders } from '$lib/auth-controller.svelte';
	import Form from '$lib/components/form/Form.svelte';
	import { loginFormConfig } from '$lib/form-configs/auth/login';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	let loginConfig = $state(loginFormConfig);
	const loginFormHandler = handleTriggerUpdate(loginConfig);
</script>

<h1>Sign in</h1>
<Form name="login form" config={loginConfig} triggerUpdate={loginFormHandler} />

<a href="/register" class="btn">Register</a>
<a href="/forgot-password" class="btn">Forgot password?</a>

<div class="auth-form-divider">
	<hr />
	<span>Or</span>
	<hr />
</div>

<div class="auth-providers-group">
	{#each appAvailableProviders as provider}
		<a
			class="btn oauth-button-{provider.name.toLowerCase()}"
			href="/auth/{provider.name.toLowerCase()}?signin"
		>
			<img
				class="icon"
				src={provider.iconPath}
				alt=""
				width="17"
				height="16"
				decoding="async"
				fetchpriority="low"
			/>
			Continue with {provider.name}
		</a>
	{/each}
</div>
