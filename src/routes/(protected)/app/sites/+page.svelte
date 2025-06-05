<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { handleTriggerUpdate } from '$lib/form-helpers';
	import { addSiteFormConfig } from '$lib/form-configs/app/add-site';
	import type { PageData } from './$types';
	import CardGroup from '$lib/components/CardGroup.svelte';
	import Card from '$lib/components/Card.svelte';
	let { data }: { data: PageData } = $props();
	let sites = $state(data.sites);

	let addSiteConfig = $state(addSiteFormConfig);
	const addSiteFormHandler = handleTriggerUpdate(addSiteConfig);
</script>

<section>
	<div class="container">
		<CardGroup>
			<Card heading="Sites">
				{#if sites.length}
					<ul>
						{#each sites as site}
							<li>
								<a class="btn" href="/app/sites/{site.id}">View {site.site_name}</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p>No sites. Go make some sales!!!</p>
				{/if}
			</Card>
			<Card heading="Add a site">
				<Form
					name="add site form"
					clearOnSuccess={true}
					classes={['default-styling', 'child-form']}
					config={addSiteConfig}
					triggerUpdate={addSiteFormHandler}
				/>
			</Card>
		</CardGroup>
	</div>
</section>
