import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

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

    // 2. grab pages for this site

    return {
        site
    };
};
