<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { forgotPasswordFormConfig } from '$lib/form-configs/auth/forgot-password';
	import { handleTriggerUpdate } from '$lib/form-helpers';

	let passformConfig = $state(forgotPasswordFormConfig);
	const passwordFormHandler = handleTriggerUpdate(passformConfig);
</script>

<h1>Forgot password</h1>
<Form name="forgot password form" config={passformConfig} triggerUpdate={passwordFormHandler} />
