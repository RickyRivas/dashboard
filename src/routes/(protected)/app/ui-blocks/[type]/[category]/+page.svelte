<script>
	import UiBlock from '$lib/components/ui-blocks/UiBlock.svelte';

	// show all assets under this type & category

	let assets = [
		{
			id: '52bb07da-fb3c-4639-b739-d885fce31011',
			title: 'in-between screens phone elemtent &  css',
			description: '',
			type: 'component',
			html: '<a class="phone in-between" href="/south-weymouth-office"> <span class="icon fa-solid fa-phone" aria-hidden="true" role="img"></span> </a> <a class="phone" href="tel:7812366225"> <span class="icon fa-solid fa-phone" aria-hidden="true" role="img"></span> <span class="cta" itemprop="telephone">(781) 236-6225</span> </a>',
			css: ".phone {\n.fs(~'clamp( 12px,'@phonefs/20em ~','@phonefs*1px ~')');\n//color:@color1;\ndisplay:inline-block;\nvertical-align:top;\n@media only screen and (max-width:1023px) {\n.lh(@trigger);\n}\n// midTab 1024oo\n@media only screen and (min-width:1024px) {\nline-height:@phonelh/@phonefs;\n}\n// midTab 1024w\n&.in-between {\ndisplay:none;\n@media only screen and (min-width:769px) and (max-width:1023px) {\n.ib;\n&+.phone {\ndisplay:none;\n}\n}\n}\n}",
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
		<!-- custom component -->
		{#each assets as asset}
			<UiBlock {asset} />
		{/each}
	</div>
</section>
