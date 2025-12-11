<script>
	import BlockViewer from '$lib/components/block-viewer/block-viewer.svelte';

	// show all assets under this type & category
	let assets = [
		{
			id: '52bb07da-fb3c-4639-b739-d885fce31011',
			title: 'in-between screens phone elemtent &  css',
			description: '',
			type: 'component',
			html: '<a class="phone in-between" href="/south-weymouth-office"> <span class="icon fa-solid fa-phone" aria-hidden="true" role="img"></span> </a> <a class="phone" href="tel:7812366225"> <span class="icon fa-solid fa-phone" aria-hidden="true" role="img"></span> <span class="cta" itemprop="telephone">(781) 236-6225</span> </a>',
			css: "@phonefs: 12; @phonelh: 12; .phone {\n.fs(~'clamp( 12px,'@phonefs/20em ~','@phonefs*1px ~')');\n//color:@color1;\ndisplay:inline-block;\nvertical-align:top; color: #000;\n@media only screen and (max-width:1023px) {\n.lh(@trigger);\n}\n// midTab 1024oo\n@media only screen and (min-width:1024px) {\nline-height:@phonelh/@phonefs;\n}\n// midTab 1024w\n&.in-between {\ndisplay:none;\n@media only screen and (min-width:769px) and (max-width:1023px) {\n.ib;\n&+.phone {\ndisplay:none;\n}\n}\n}\n}",
			javascript: '',
			thumbnailurl: '',
			category: 'html',
			favorite: false,
			created_at: '2024-10-20T23:23:47.18863+00:00',
			updated_at: '2024-10-20T23:23:46.595+00:00',
			buildtime: null
		}
	];
</script>

<section>
	<div class="container">
		{#if assets.length > 0}
			<div class="ui-blocks">
				{#each assets as asset}
					<BlockViewer {asset} />
				{/each}
			</div>
		{:else}
			<p>No assets.</p>
		{/if}
	</div>
</section>
