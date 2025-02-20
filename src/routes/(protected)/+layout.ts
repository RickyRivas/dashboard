import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from "./$types";
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
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

    if (!session || !user) {
        redirect(303, '/')
    }

    // grab profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", user.id)
        .single()

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    return { session, supabase, user, profile, amr: aal?.currentAuthenticationMethods };
}