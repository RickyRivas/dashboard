import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { SitePage } from "$lib/types";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid } = params
    let sitePages: SitePage[] | undefined;

    // 1. grab site from sites table
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)

    // 2. grab pages
    const { data: site_pages, error: sitePagesError } = await supabase
        .from('site_pages')
        .select('*')
        .eq('site_id', siteid)
        .order('display_order', { ascending: true })

    if (site_pages && !sitePagesError) sitePages = site_pages


    return {
        site, sitePages
    };
};

export const actions: Actions = {
    addNewPage: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid } = params;
        const { user } = await safeGetSession();
        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        const newPage = {
            site_id: siteid,
            title: data.title as string,
            slug: data.slug as string
        }

        const { data: sitePages, error: sitePagesError } = await supabase
            .from('site_pages')
            .insert(newPage)
            .select()
            .single()

        if (sitePagesError) return fail(400, { message: `Error creating site page: ${sitePagesError.message}` });

        return { success: true, sitePages }
    }
}