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

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email.trim() || !password.trim()) {
            return fail(400, { message: 'Email or Password missing.' })
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            const { status } = error
            if (status === 400) return fail(status, { message: 'Username or Password is incorrect.' })
            else return fail(status, { message: error.message })
        } else {
            // success!
            redirect(303, authRedirect)
        }
    },
    logout: async ({ locals }) => {
        await locals.supabase.auth.signOut()
    }
} 