import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { SitePage } from "$lib/types";

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
