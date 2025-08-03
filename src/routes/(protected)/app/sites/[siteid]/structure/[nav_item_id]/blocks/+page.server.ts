import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

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

    // this page only allows for editing of "page" nav item types
    if (navItem.navigation_item_type !== 'page') throw redirect(303, `/app/sites/${siteid}/structure`)

    return {
        site, navItem
    };
};

export const actions: Actions = {}