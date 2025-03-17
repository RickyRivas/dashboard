import { isAuthApiError } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

// email signup/change confirm redirects here with code param
export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code') as string;
    if (code) {
        try {
            await supabase.auth.exchangeCodeForSession(code)
        } catch (error) {
            // If you open in another browser, need to redirect to login.
            // Should not display error
            if (isAuthApiError(error)) {
                redirect(303, "/login?verified=true")
            } else {
                throw error
            }
        }
    }

    const next = url.searchParams.get("next")
    if (next) redirect(303, next)

    redirect(303, "/app")
};