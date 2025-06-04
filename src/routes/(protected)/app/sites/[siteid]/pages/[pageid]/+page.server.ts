import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

const redirectPath = '/app/sites'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
    const { siteid, pageid } = params

    // 1. grab site
    const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteid)
        .single()

    if (error) throw redirect(303, redirectPath)

    // 2. grab page
    const { data: page, error: pageError } = await supabase
        .from('site_pages')
        .select('*')
        .eq('id', pageid)
        .single()

    if (pageError) throw redirect(303, redirectPath)

    return {
        site, page
    };
};


export const actions: Actions = {
    updatePage: async ({ request, params, locals: { supabase, safeGetSession } }) => {
        const { siteid, pageid } = params;
        const { user } = await safeGetSession();

        // Verify site ownership first
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .select('id')
            .eq('id', siteid)
            .eq('user_id', user.id)
            .single();

        if (siteError || !site) {
            return fail(400, { message: 'Unauthorized' });
        }

        // Verify page belongs to this site
        const { data: existingPage, error: pageError } = await supabase
            .from('site_pages')
            .select('id, is_homepage')
            .eq('id', pageid)
            .eq('site_id', siteid)
            .single();

        if (pageError || !existingPage) {
            return fail(400, { message: 'Page not found' });
        }

        // Get form data 
        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        // Process the form data
        const pageData = {
            title: data.title as string,
            slug: data.slug as string,
            content: data.content ? JSON.parse(data.content as string) : null,
            meta_title: data.meta_title as string || null,
            meta_description: data.meta_description as string || null,
            featured_image: data.featured_image as string || null,
            page_type: data.page_type as string || 'standard',
            template: data.template as string || null,
            parent_id: data.parent_id as string || null,
            display_order: parseInt(data.display_order as string) || 0,
            is_published: data.is_published === 'on',
            is_homepage: data.is_homepage === 'on'
        };

        // Handle homepage logic - only one homepage per site
        // if (pageData.is_homepage && !existingPage.is_homepage) {
        //     // Remove homepage status from other pages
        //     const { error: homepageError } = await supabase
        //         .from('site_pages')
        //         .update({ is_homepage: false })
        //         .eq('site_id', siteid)
        //         .eq('is_homepage', true);

        //     if (homepageError) {
        //         console.error('Error updating existing homepage:', homepageError);
        //         return fail(400, { message: 'Failed to update homepage status' });
        //     }
        // }

        // Validate slug uniqueness within the site
        const { data: existingSlug, error: slugError } = await supabase
            .from('site_pages')
            .select('id')
            .eq('site_id', siteid)
            .eq('slug', pageData.slug)
            .neq('id', pageid)
            .single();

        if (existingSlug) {
            return fail(400, {
                message: 'Slug already exists',
                errors: [{ field: 'slug', message: `${pageData.slug} slug already exists` }]
            });
        }

        // Update the page
        const { data: updatedPage, error: updateError } = await supabase
            .from('site_pages')
            .update({
                ...pageData,
                updated_at: new Date().toISOString()
            })
            .eq('id', pageid)
            .select();

        if (updateError) {
            console.error('Error updating page:', updateError);
            return fail(400, {
                message: `Failed to update page: ${updateError.message}`
            });
        }

        return {
            success: true,
            message: 'Page updated successfully',
            page: updatedPage
        };
    },
}