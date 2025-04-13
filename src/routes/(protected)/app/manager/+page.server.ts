import { fail, redirect, type Actions } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js'
import type { PageServerLoad } from "../$types";

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

let table = 'code_snippets'

export const load: PageServerLoad = async ({ request, url }) => {
    // editing code assets
    const codeAssetId = url.searchParams.get('code_asset_id')

    if (codeAssetId) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', codeAssetId)
            .single()

        if (data) return { success: true, codeAsset: data }
    }
}

export const actions: Actions = {
    addToManager: async ({ request }) => {
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
            return { success: true, redirectTo: `/app/${type}s/${category}/${assetId}` }
        } else {
            // new code asset
            const { data, error } = await supabase
                .from(table)
                .insert({
                    title, description, type, category, thumbnailurl, buildtime, favorite, html, css, javascript
                })
                .select()

            if (error) return fail(400, { message: 'Error adding new code asset.', errors: [] })
            return { success: true, redirectTo: `/app/${type}s/${category}/${data[0].id}` }
        }
    },
    delete: async ({ request }) => {

        const formData = await request.formData();
        const id = formData.get('code-asset-id');
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