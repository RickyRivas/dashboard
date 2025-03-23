<script lang="ts">
	import { page } from '$app/state';
	let { id, favorite = false }: { id: string; favorite: boolean } = $props();
	let table = 'code_snippets';

	async function toggleFavorite(id: string) {
		try {
			const { data: currentSnippet, error: fetchError } = await page.data.supabase
				.from(table)
				.select('favorite')
				.eq('id', id)
				.single();

			if (fetchError) throw fetchError;

			// Toggle the favorite status
			const newFavoriteStatus = !currentSnippet.favorite;

			// Update the snippet with the new favorite status
			const { data, error: updateError } = await page.data.supabase
				.from(table)
				.update({ favorite: newFavoriteStatus })
				.eq('id', id)
				.select()
				.single();

			if (updateError) throw updateError;

			return { data };
		} catch (error) {
			return { error };
		}
	}
</script>

<label class="star-label" for="component-fav-toggle-{id}">
	<!-- {field.label} -->
	<input
		type="checkbox"
		name="component-fav-toggle-{id}"
		id="component-fav-toggle-{id}"
		bind:checked={favorite}
		onchange={async () => {
			await toggleFavorite(id);
		}}
	/>
	<svg
		class="star-icon"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="91"
		fill="none"
		viewBox="0 0 96 91"
	>
		<path
			fill="transparent"
			stroke="#FF0"
			stroke-width="5"
			d="m48 1.618 10.75 33.086.112.345h35.152L65.87 55.497l-.294.214.112.345 10.75 33.086-28.144-20.448L48 68.48l-.294.214-28.144 20.448 10.75-33.086.112-.345-.294-.214L1.986 35.05h35.152l.112-.345L48 1.618Z"
		/>
	</svg>
</label>

<style lang="less">
	.star-label {
		input[type='checkbox'] {
			display: none;

			&:checked ~ .star-icon path {
				fill: #ff0;
			}
		}
	}

	.star-icon {
		width: 2em;
		display: inline-block;
		vertical-align: middle;

		path {
			transition:
				fill 0.33s ease,
				stroke 0.33s ease;
		}
	}
</style>
