import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
    // if signed in already, redirect
    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, '/app');
    }

    // Extract the query parameters from the URL
    const email = url.searchParams.get('email') || '';
    const name = url.searchParams.get('name') || '';
    const existing = url.searchParams.get('existing');

    if (!email) redirect(303, '/login')

    // Return them as props to the page
    return {
        email,
        name,
        existing
    };
}

export const actions: Actions = {
    resendVerificationEmail: async ({ request, url, locals: { supabase } }) => {
        try {
            const formData = await request.formData()
            const email = formData.get('email') as string

            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: `${url.origin}/auth/confirm`
                }
            })

            if (error) return fail(error.status as number, { message: 'Something went wrong.' })
            return { success: true }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    }
}