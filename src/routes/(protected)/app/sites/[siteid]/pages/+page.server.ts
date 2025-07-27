import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid } = params

    // 1. grab site from sites table
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)

    // 2. grab pages
    const { data: site_navigation, error: site_navigation_error } = await supabase
        .from('site_navigation')
        .select('*')
        .eq('site_id', siteid)
        .order('display_order', { ascending: true })


    return {
        site, site_navigation
    };
};

export const actions: Actions = {
    createNavItem: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid } = params;
        const { user } = await safeGetSession();
        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        const newPage = {
            site_id: siteid,
            title: data.title as string,
            navigation_item_type: data.navigation_item_type
        }

        // if link, instead of passing slug, pass external_url
        if (data.navigation_item_type === 'link') {
            newPage.external_url = data.slug
        } else {
            newPage.slug = data.slug
        }

        // optional parent id, default will go to root
        if (data.parent_id) {
            newPage.parent_id = data.parent_id
        }

        const { data: addedPage, error: sitePagesError } = await supabase
            .from('site_navigation')
            .insert(newPage)
            .select()
            .single()

        if (sitePagesError) return fail(400, { message: `Error creating site page: ${sitePagesError.message}` });

        return { success: true, addedPage }
    }
}