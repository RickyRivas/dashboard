<script lang="ts">
	import type { Site, SiteNavigationItem } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const navItem = $state(data.navItem) as SiteNavigationItem;
	const site = $state(data.site) as Site;
</script>

<section>
	<div class="container">
		<h1>{site.site_name} Blocks</h1>
	</div>
</section>
