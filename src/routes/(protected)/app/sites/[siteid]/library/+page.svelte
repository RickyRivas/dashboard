<script lang="ts">
	import SectionForm from '$lib/components/cms/sections/SectionForm.svelte';
	import type { Site, SiteNavigationItem } from '$lib/types';
	import type { PageData } from '../$types';

	let { data }: { data: PageData } = $props();
	const site = $state(data.site) as Site;
</script>

<section>
	<div class="container">
		<h1>{site.site_name} Sections Library</h1>
		<p>The sections in this library are available for this site.</p>
	</div>
</section>

<section>
	<div class="container">
		<h2>{site.site_name} CMS Library</h2>
		<SectionForm />
	</div>
</section>
