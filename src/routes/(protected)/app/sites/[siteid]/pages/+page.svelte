<script lang="ts">
	import type { Site } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	const {
		site
	}: {
		site: Site;
	} = data;
</script>

<section>
	<div class="container">
		<h1>All sites Pages for {site.site_name}</h1>
	</div>
</section>
