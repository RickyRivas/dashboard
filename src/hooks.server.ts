import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js"
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const auth: Handle = async ({ event, resolve }) => {
    /**
         * Creates a Supabase client specific to this server request.
         *
         * The Supabase client gets the Auth token from the request cookies.
         */

    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            /**
             * SvelteKit's cookies API requires `path` to be explicitly set in
             * the cookie options. Setting `path` to `/` replicates previous/
             * standard behavior.
             */

            /** example:
            event.locals.supabase.cookies.setAll([
                { name: 'session', value: 'abc123', options: { maxAge: 3600 } },
                { name: 'user', value: 'jane', options: { secure: true } }
            ]);
             */
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' });
                });
            }
        }
    })

    // admin-level access that bypasses security restrictions
    event.locals.supabaseServiceRole = createClient(
        PUBLIC_SUPABASE_URL,
        PRIVATE_SUPABASE_SERVICE_ROLE,
        // ensures the elevated permissions aren't accidentally stored in cookies.
        { auth: { persistSession: false } },
    )

    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession()
        if (!session) return { session: null, user: null }

        const { data: { user }, error } = await event.locals.supabase.auth.getUser();
        if (error) return { session: null, user: null }

        return { session, user }
    }

    return resolve(event, {
        // Supabase libraries use the `content-range` and `x-supabase-api-version`
        // headers, so we need to tell SvelteKit to pass it through.
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        }
    })
}

// chain multiple handle functions together. will add cookie handlers for theme mode as well
export const handle: Handle = sequence(auth)