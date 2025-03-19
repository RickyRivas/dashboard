import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getRouteGroup, findRouteInfo, getNavRoutes, getBreadcrumbs, type RouteGroup, type RouteInfo } from '$lib/navigation';

export const load: LayoutLoad = async ({ url, data, depends, fetch }) => {
    const currentPath = url.pathname;
    const routeGroup = getRouteGroup(currentPath);
    const routeInfo = findRouteInfo(currentPath);

    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth');

    // compared to my old implementation, this uses default browser cookie handling 
    const supabase = isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch
            }
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch
            },
            cookies: {
                getAll() {
                    return data.cookies;
                }
            }
        });

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
        data: { session }
    } = await supabase.auth.getSession();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (routeGroup === 'protected') {
        if (session && !user) {
            throw redirect(303, `/auth/confirm?signout=true&access_token=${session.access_token}`)
        }

        if (!session || !user) {
            throw redirect(303, '/')
        }
        // grab profile data
        const { data: profile, error: fetchProfileError } = await supabase
            .from("profiles")
            .select(`*`)
            .eq("id", user.id)
            .single()

        // special case: If authenticated but no profile row in DB, recreate it from auth data
        // todo: notify admin
        if (fetchProfileError && fetchProfileError.code === 'PGRST116') {
            console.warn(`User ${session.user.id} missing profile, recreating`);

            // Extract basic info from auth that you collected at signup
            await supabase
                .from('profiles')
                .insert({
                    id: session.user.id,
                    full_name: '',
                    updated_at: new Date()
                });

            // hard return new data
            const tempProfileData = {
                id: session.user.id,
                full_name: '',
                updated_at: new Date()
            }

            return { session, supabase, user, profile: tempProfileData, amr: null }
        }

        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

        return { session, supabase, user, profile, amr: aal?.currentAuthenticationMethods };
    }


    // if public route
    return { session, user }
}