import { authRedirect } from "$lib/supabase-auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const load = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, '/app');
    }
}

export const actions: Actions = {
    login: async ({ request, locals }) => {
        const { supabase } = locals;

        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email.trim() || !password.trim()) {
            return fail(400, { message: 'Email or Password missing.' })
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            const { status } = error
            if (status === 400) return fail(status, { message: 'Username or Password is incorrect.' })
            if (status === 500) return fail(status, { message: 'Server error. Please try again later.' })
        } else {
            // success!
            redirect(303, authRedirect)
        }
    },
    logout: async ({ locals }) => {
        await locals.supabase.auth.signOut()
    }
} 