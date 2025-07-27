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
        .from('site_navigation')
        .select('*')
        .eq('id', pageid)
        .single()

    if (pageError) throw redirect(303, redirectPath)

    return {
        site, page
    };
};


export const actions: Actions = {
    updateNavItem: async ({ request, params, locals: { supabase, safeGetSession } }) => {
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

        // Verify nav item belongs to this site
        const { data: existingNavItem, error: navItemError } = await supabase
            .from('site_navigation')
            .select('id')
            .eq('id', pageid)
            .eq('site_id', siteid)
            .single();

        if (navItemError || !existingNavItem) {
            return fail(400, { message: 'Navigation item not found' });
        }

        // Get form data 
        const formData = await request.formData();
        const data = Object.fromEntries([...formData]);

        // Process the form data based on new schema
        const navItemData = {
            title: data.title as string,
            navigation_item_type: data.navigation_item_type as 'page' | 'folder' | 'link',
            is_published: data.is_published === 'on',
            parent_id: data.parent_id as string || null,
            display_order: data.display_order ? parseInt(data.display_order as string) : 0,
            description: data.description as string || null,

            // Fields that depend on type
            slug: data.slug as string || null,
            external_url: data.external_url as string || null,
            link_target: data.link_target as string || null,

            // SEO fields
            meta_title: data.meta_title as string || null,
            meta_description: data.meta_description as string || null,
            meta_keywords: data.meta_keywords as string || null,
            meta_robots: data.meta_robots as string || null,
            canonical_url: data.canonical_url as string || null,

            // Open Graph fields
            og_title: data.og_title as string || null,
            og_description: data.og_description as string || null,
            og_image: data.og_image as string || null,
            og_type: data.og_type as string || null,
            og_url: data.og_url as string || null,

            // Twitter fields
            twitter_card: data.twitter_card as string || null,
            twitter_title: data.twitter_title as string || null,
            twitter_description: data.twitter_description as string || null,
            twitter_image: data.twitter_image as string || null,
            twitter_creator: data.twitter_creator as string || null,
            twitter_site: data.twitter_site as string || null,

            // Additional SEO
            featured_image: data.featured_image as string || null,
            schema_markup: data.schema_markup ? JSON.parse(data.schema_markup as string) : null
        };

        // Validation for navigation item types
        if (!['page', 'folder', 'link'].includes(navItemData.navigation_item_type)) {
            return fail(400, {
                message: 'Invalid navigation item type',
                errors: [{ field: 'navigation_item_type', message: 'Must be page, folder, or link' }]
            });
        }

        // Type-specific validation
        if (navItemData.navigation_item_type === 'page' && (!navItemData.slug || navItemData.slug === '')) {
            return fail(400, {
                message: 'Page slug is required',
                errors: [{ field: 'slug', message: 'Pages must have a slug' }]
            });
        }

        if (navItemData.navigation_item_type === 'link' && (!navItemData.external_url || navItemData.external_url === '')) {
            return fail(400, {
                message: 'External URL is required for links',
                errors: [{ field: 'external_url', message: 'Links must have an external URL' }]
            });
        }

        // Validate parent_id exists if provided
        if (navItemData.parent_id) {
            const { data: parentExists, error: parentError } = await supabase
                .from('site_navigation')
                .select('id, navigation_item_type')
                .eq('id', navItemData.parent_id)
                .eq('site_id', siteid)
                .single();

            if (!parentExists) {
                return fail(400, {
                    message: 'Invalid parent item',
                    errors: [{ field: 'parent_id', message: 'Parent item does not exist' }]
                });
            }

            // Business rule validation
            if (navItemData.navigation_item_type === 'page' && parentExists.navigation_item_type !== 'folder') {
                return fail(400, {
                    message: 'Pages can only be placed in folders',
                    errors: [{ field: 'parent_id', message: 'Pages can only be children of folders' }]
                });
            }

            if (navItemData.navigation_item_type === 'folder' && parentExists.navigation_item_type === 'page') {
                return fail(400, {
                    message: 'Folders cannot be placed inside pages',
                    errors: [{ field: 'parent_id', message: 'Folders cannot be children of pages' }]
                });
            }

            if (navItemData.navigation_item_type === 'link' && parentExists.navigation_item_type === 'page') {
                return fail(400, {
                    message: 'Links cannot be placed inside pages',
                    errors: [{ field: 'parent_id', message: 'Links cannot be children of pages' }]
                });
            }
        }

        // Validate slug uniqueness within the site (only for pages and folders with slugs)
        if (navItemData.slug) {
            const { data: existingSlug, error: slugError } = await supabase
                .from('site_navigation')
                .select('id')
                .eq('site_id', siteid)
                .eq('slug', navItemData.slug)
                .neq('id', pageid)
                .single();

            if (existingSlug) {
                return fail(400, {
                    message: 'Slug already exists',
                    errors: [{ field: 'slug', message: `${navItemData.slug} slug already exists` }]
                });
            }
        }

        // Update the navigation item
        const { data: updatedNavItem, error: updateError } = await supabase
            .from('site_navigation')
            .update({
                ...navItemData,
                updated_at: new Date().toISOString()
            })
            .eq('id', pageid)
            .select();

        if (updateError) {
            console.error('Error updating navigation item:', updateError);
            return fail(400, {
                message: `Failed to update navigation item: ${updateError.message}`
            });
        }

        return {
            success: true,
            message: 'Navigation item updated successfully',
            navItem: updatedNavItem
        };
    },
}