import { fail, redirect, type Actions } from "@sveltejs/kit";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
)

let table = 'code_snippets'

export const actions: Actions = {
    addToManager: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description')
        const type = formData.get('type')
        const category = formData.get('category')
        const thumbnailurl = formData.get('thumbnail-url')
        const buildtime = formData.get('build-time')
        const html = formData.get('html')
        const css = formData.get('css')
        const javascript = formData.get('javascript')
        const favorite = formData.get('favorite')

        // save to SB
        const { data, error } = await supabase
            .from(table)
            .insert({
                title, description, type, category, thumbnailurl, buildtime, favorite, html, css, javascript
            })
            .select()

        if (error) {
            console.log(error)
            return fail(400, { message: 'Error adding new code asset.', errors: [] })
        }
        return { success: true }
    }
}