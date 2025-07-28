<script lang="ts">
	import type { Site, SiteNavigationItem } from '$lib/types';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const navItem = $state(data.navItem) as SiteNavigationItem;
	const site = $state(data.site) as Site;
</script>

<section>
	<div class="container">
		<a href="/app/sites/{site.id}/structure/{navItem.id}/seo" class="btn">Page SEO</a>
		<a href="/app/sites/{site.id}/structure/{navItem.id}/blocks" class="btn">Page Blocks</a>
	</div>
</section>
