import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

const table = 'code_snippets'

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const assetIdProvided = url.searchParams.get('code_asset_id');
    if (assetIdProvided) {
        const { data: codeAsset, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', assetIdProvided)
            .single()

        if (error) {
            redirect(303, "/app/manager")
        }

        return { codeAsset }
    }
}

export const actions: Actions = {
    addToLibrary: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();

        const title = formData.get('title');
        const description = formData.get('description')
        const type = formData.get('type')
        const category = formData.get('category')
        const thumbnailurl = formData.get('thumbnailurl')
        const buildtime = formData.get('buildtime')
        const html = formData.get('html')
        const css = formData.get('css')
        const javascript = formData.get('javascript')
        const favorite = formData.get('favorite')
        const assetId = formData.get('code-asset-id')

        if (assetId) {
            // editing code asset
            const { data, error } = await supabase
                .from(table)
                .update({
                    title, description, type, category, thumbnailurl, buildtime, favorite, html, css, javascript
                })
                .eq('id', assetId)
                .select()
            if (error) return fail(400, { message: 'Error updating new code asset.', errors: [] })
            return { success: true, redirectTo: type === 'snippet' ? `/app/${type}s` : `/app/${type}s/${category}/${assetId}` }
        } else {
            // new code asset
            const { data, error } = await supabase
                .from(table)
                .insert({
                    title, description, type, category, thumbnailurl, buildtime, favorite, html, css, javascript
                })
                .select()

            if (error) return fail(400, { message: 'Error adding new code asset.', errors: [] })
            // snippets doesnt have any child pages. 
            return { success: true, redirectTo: type === 'snippet' ? `/app/${type}s` : `/app/${type}s/${category}/${data[0].id}` }
        }
    },
    delete: async ({ request, locals: { supabase } }) => {

        const formData = await request.formData();
        const id = formData.get('id');
        const type = formData.get('type');
        const category = formData.get('category');

        const { data, error } = await supabase
            .from(table)
            .delete()
            .match({ id: id })
            .select()

        if (error) return fail(400, { message: 'Error updating new code asset.', errors: [] })
        return { success: true, redirectTo: `/app/${type}s` }
    }
}