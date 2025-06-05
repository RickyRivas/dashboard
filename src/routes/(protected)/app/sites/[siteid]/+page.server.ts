import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

import type { Site, SiteContacts, SiteInformation, SiteProcessChecklist } from "$lib/types";
import type { Actions } from "@sveltejs/kit";
import { deleteSiteSchema, validateForm } from "$lib/zod-helper";

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
    removeSite: async ({ params, request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData()
        const { siteid } = params
        const { user } = await safeGetSession()

        const confirm = formData.get('confirm')
        const validateFormResult = await validateForm(deleteSiteSchema, { confirm })
        if (validateFormResult.errors) return fail(400, { errors: validateFormResult.errors });

        const { error } = await supabase
            .from('sites')
            .delete()
            .eq('id', siteid)
            .eq('user_id', user.id);

        if (error) {
            return fail(500, { message: `Failed to remove site: ${error.message}` });
        }

        return { success: true, redirectTo: "/app/sites" };
    }
}