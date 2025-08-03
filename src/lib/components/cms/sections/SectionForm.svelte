<script lang="ts">
	import { enhance } from '$app/forms';
	import FieldList from '$lib/components/cms/sections/FieldList.svelte';
</script>

<form
	id="cms-section-form"
	class="default-styling"
	action="?/createSection"
	method="post"
	use:enhance={() => {
		return async function ({ result }) {
			console.log(result);
		};
	}}
>
	<!-- Section Name -->
	<div class="form-control">
		Section Name
		<label for="section-name">
			<input type="text" name="section-name" id="section-name" required />
		</label>
	</div>

	<div class="form-control">
		<!-- Dynamic Fields -->
		<label> Fields/Entries </label>
		<FieldList />
	</div>

	<!-- Submit -->
	<button class="btn">Submit</button>
</form>
