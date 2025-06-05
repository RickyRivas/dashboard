import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { Site, SiteContacts, SiteInformation, SiteProcessChecklist } from "$lib/types";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid } = params

    let siteContacts: SiteContacts | undefined
    let siteInformation: SiteInformation | undefined
    let siteChecklist: SiteProcessChecklist | undefined

    // 1. grab site from sites table
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)



    // 3. site contacts table
    const { data: site_contacts, error: siteContactsError } = await supabase
        .from('site_contacts')
        .select('*')
        .eq('site_id', siteid)
        .single()

    if (site_contacts && !siteContactsError) siteContacts = site_contacts


    // 4. site information table
    const { data: site_information, error: siteInformationError } = await supabase
        .from('site_information')
        .select('*')
        .eq('site_id', siteid)
        .single()

    if (site_information && !siteInformationError) siteInformation = site_information

    // 5. site checklist
    const { data: site_checklist, error: siteChecklistError } = await supabase
        .from('site_process_checklist')
        .select('*')
        .eq('site_id', siteid)
        .single()

    if (site_checklist && !siteChecklistError) siteChecklist = site_checklist

    return {
        site, siteContacts, siteInformation, siteChecklist
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