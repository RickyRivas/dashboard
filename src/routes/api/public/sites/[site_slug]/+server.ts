import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { json, error } from '@sveltejs/kit';

const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    // change back to reg key and update RLS policies
    PRIVATE_SUPABASE_SERVICE_ROLE
);

export async function GET({ params, url }) {
    const { site_slug } = params

    console.log(site_slug)

    try {
        // Get site info
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .select('*')
            .eq('id', site_slug)
            .single()

        console.log(siteError)

        if (siteError || !site) {
            throw error(404, 'Site not found');
        }

        const { data: site_navigation, error: sitePagesError } = await supabase
            .from('site_navigation')
            .select('*')
            .eq('site_id', site_slug)
            .order('display_order', { ascending: true })


        // Get all published pages for this site
        //     const { data: pages, error: pagesError } = await supabase
        //         .from('pages')
        //         .select(`
        //     id,
        //     title,
        //     slug,
        //     content_html,
        //     components,
        //     meta_title,
        //     meta_description,
        //     published_at,
        //     updated_at
        //   `)
        //         .eq('site_id', site.id)
        //         .eq('published', true)
        //         .order('updated_at', { ascending: false });

        //     if (pagesError) {
        //         throw error(500, 'Failed to fetch pages');
        //     }

        return json({
            site,
            site_navigation,
            // total: pages.length,
            generated_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('API Error:', err);
        throw error(500, 'Internal server error');
    }
}