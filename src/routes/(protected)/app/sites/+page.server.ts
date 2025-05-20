import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { user } = await safeGetSession()

    const { data: sites, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', user.id)

    return {
        sites: error ? [] : sites
    };
};

export const actions: Actions = {
    addNewSite: async ({ request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData()
        const data = Object.fromEntries([...formData])
        const { user } = await safeGetSession()

        // 1. add new site
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .insert([
                {
                    site_name: data.site_name,
                    user_id: user.id,
                }
            ])
            .select()
            .single()

        if (siteError) return fail(400, { message: `Error creating site: ${siteError}` });

        // 2. create an associated site contacts table
        const { error: contactError } = await supabase
            .from('site_contacts')
            .insert([
                {
                    site_id: site.id
                }
            ]);

        if (contactError) {
            return { success: true, site, errorMessage: `Error creating site contact record: ${contactError}` };
        }

        // grab site information
        const { error: informationError } = await supabase
            .from('site_information')
            .insert([
                {
                    site_id: site.id
                }
            ]);

        if (informationError) {
            return { success: true, site, errorMessage: `Error creating site information record: ${contactError}` };
        }

        return { success: true }
    }
}