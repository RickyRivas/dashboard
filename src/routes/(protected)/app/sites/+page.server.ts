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

        if (siteError) return fail(400, { message: `Error creating site: ${siteError.message}` });

        // 2. create a home page.
        const { data: sitePages, error: sitePagesError } = await supabase
            .from('site_pages')
            .insert([
                {
                    site_id: site.id,
                    title: 'home',
                    slug: 'home',
                    is_homepage: true
                }
            ])
            .select()
            .single()

        if (sitePagesError) return fail(400, { message: `Error creating site page: ${sitePagesError.message}` });


        // 3. create an associated site contacts table
        const { error: contactError } = await supabase
            .from('site_contacts')
            .insert([
                {
                    site_id: site.id
                }
            ]);

        if (contactError) return fail(400, { message: `Error creating site contact record: ${contactError.message}` })

        // 4. create site information table
        const { error: informationError } = await supabase
            .from('site_information')
            .insert([
                {
                    site_id: site.id
                }
            ]);

        if (informationError) return fail(400, { message: `Error creating site information record: ${informationError.message}` })

        // 5. create site checklist table
        const { error: checklistError } = await supabase
            .from('site_process_checklist')
            .insert([
                {
                    site_id: site.id
                }
            ]);

        if (checklistError) return fail(400, { message: `Error creating site checklist record: ${checklistError?.message}` })

        return { success: true, redirectTo: `/app/sites/${site.id}` }
    },

}