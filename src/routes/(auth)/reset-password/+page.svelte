<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { resetPasswordFormConfig } from '$lib/form-configs/auth/reset';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	let resetConfig = $state(resetPasswordFormConfig);
	const resetFormHandler = handleTriggerUpdate(resetConfig);
</script>

<h1>Please reset your password below.</h1>
<Form name="reset password form" config={resetConfig} triggerUpdate={resetFormHandler} />
