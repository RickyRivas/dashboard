import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { EmailOtpType } from '@supabase/supabase-js';
import type { PageServerLoad } from "./$types";
import { newPasswordSchema, validateForm } from "$lib/zod-helper";

// user needs to be redirected from email with valid token to visit page
export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const token_hash = url.searchParams.get('token_hash') as string;
    const type = url.searchParams.get('type') as EmailOtpType | null;

    if (token_hash && type === 'recovery') {
        // verify token hash for valid recovery session
        const { error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) redirect(303, '/')
    } else {
        // redirect home if not a recovery session
        redirect(303, '/')
    }
};

export const actions: Actions = {
    resetPassword: async ({ request, locals }) => {
        try {
            const formData = await request.formData()
            const newPassword = formData.get('newPassword') as string
            const newPasswordConfirmed = formData.get('confirmPassword') as string

            const validateFormResult = await validateForm(newPasswordSchema, {
                newPassword,
                newPasswordConfirmed
            })

            if (validateFormResult.errors) return fail(400, { errors: validateFormResult.errors });

            const { error } = await locals.supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) return fail(error.status as number, { message: error.message });

            return { success: true, redirectTo: '/app' }

        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    }
};