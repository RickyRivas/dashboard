import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid, nav_item_id } = params

    // 1. grab site
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)

    // 2. grab page
    const { data: navItem, error: navItemFetchError } = await supabase
        .from('site_navigation')
        .select('*')
        .eq('id', nav_item_id)
        .single()

    if (navItemFetchError) throw redirect(303, redirectPath)

    return {
        site, navItem
    };
};

