import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { Site, SiteContacts, SiteInformation, SitePage, SiteProcessChecklist } from "$lib/types";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid } = params

    let sitePages: SitePage[] | undefined;
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

    // 2. grab pages
    const { data: site_pages, error: sitePagesError } = await supabase
        .from('site_pages')
        .select('*')
        .eq('site_id', siteid)
        .order('display_order', { ascending: true })

    if (site_pages && !sitePagesError) sitePages = site_pages


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
        site, sitePages, siteContacts, siteInformation, siteChecklist
    };
};

export const actions: Actions = {
    updateContacts: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid } = params;
        const { user } = await safeGetSession();

        // Verify site ownership
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .select('id')
            .eq('id', siteid)
            .eq('user_id', user.id)
            .single();

        if (siteError || !site) {
            return fail(400, { message: 'Unauthorized' })
        }

        const formData = await request.formData();
        const contactData = {
            primary_contact_name: formData.get('primary_contact_name') as string,
            primary_phone: formData.get('primary_phone') as string,
            primary_email: formData.get('primary_email') as string,
            secondary_contact_name: formData.get('secondary_contact_name') as string,
            secondary_phone: formData.get('secondary_phone') as string,
            secondary_email: formData.get('secondary_email') as string,
            business_address: formData.get('business_address') as string,
            business_phone: formData.get('business_phone') as string,
            business_email: formData.get('business_email') as string,
            preferred_contact_method: formData.get('preferred_contact_method') as string
        };

        const { data: existingContact, error: existingContactError } = await supabase
            .from('site_contacts')
            .select('id')
            .eq('site_id', siteid)
            .single();

        if (existingContactError) return fail(400, { message: existingContactError.message })

        // Update existing record
        const { data, error } = await supabase
            .from('site_contacts')
            .update(contactData)
            .eq('id', existingContact?.id)
            .select();

        if (error) return fail(400, { message: error.message })

        return {
            success: true,
        };
    },
    updateSiteInfo: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid } = params;
        const { user } = await safeGetSession();

        // Verify site ownership
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .select('id')
            .eq('id', siteid)
            .eq('user_id', user.id)
            .single();

        if (siteError || !site) {
            return fail(400, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        // Process date fields to ensure proper format
        const siteInfoData = {
            domain_name: data.domain_name as string,
            start_date: data.start_date ? data.start_date as string : null,
            estimated_end_date: data.estimated_end_date ? data.estimated_end_date as string : null,
            launch_date: data.launch_date ? data.launch_date as string : null,
            website_status: data.website_status as string,
            spec_url: data.spec_url as string,
            build_link: data.build_link as string,
            proof_link: data.proof_link as string,
            hosting_provider: data.hosting_provider as string,
            cms_platform: data.cms_platform as string,
            analytics_id: data.analytics_id as string,
            project_notes: data.project_notes as string
        };

        // Check if record already exists
        const { data: existingInfo, error } = await supabase
            .from('site_information')
            .select('id')
            .eq('site_id', siteid)
            .single();

        if (error) return fail(400, { message: 'Failed to save site information' })

        // Update existing record
        const { data: site_information, error: siteInformationError } = await supabase
            .from('site_information')
            .update(siteInfoData)
            .eq('id', existingInfo?.id)
            .select();


        if (siteInformationError) {
            return fail(400, {
                message: siteInformationError.message
            });
        }

        return {
            success: true,
        };
    },
    updateChecklistItem: async ({ request, params, locals: { supabase } }) => {
        const { siteid } = params;

        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        const { data: checklistItemUpdated, error } = await supabase
            .from('site_process_checklist')
            .update(data)
            .eq('site_id', siteid);

        if (error) {
            return fail(500, { message: 'Failed to update status', errors: [{ field: Object.keys(data)[0], message: error.message }] });
        }

        return { success: true }
    }
}