import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { EmailOtpType } from '@supabase/supabase-js';
import { z } from "zod";
import type { PageServerLoad } from "./$types";

// user needs to be redirected from email with valid token to visit page
export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
    const token_hash = url.searchParams.get('token_hash') as string;
    const type = url.searchParams.get('type') as EmailOtpType | null;

    if (token_hash && type === 'recovery') {
        // verify token hash for valid recovery session
        const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) redirect(303, '/')
    } else {
        // redirect home if not a recovery session
        redirect(303, '/')
    }
};

export const actions: Actions = {
    resetPassword: async ({ request, locals }) => {
        const formData = await request.formData()
        const newPassword = formData.get('newPassword') as string
        const newPasswordConfirmed = formData.get('confirmPassword') as string

        const newPasswordSchema = z
            .object({
                newPassword: z.string()
                    .min(6, "Password must be at least 6 characters")
                    .regex(/[A-Z]/, "Must contain uppercase letter")
                    .regex(/[0-9]/, "Must contain number"),
                newPasswordConfirmed: z.string()
            })
            .refine((data) => data.newPassword === data.newPasswordConfirmed, {
                message: "Passwords don't match",
                path: ["confirmPassword"]
            });

        // validate
        const validationResult = newPasswordSchema.safeParse({
            newPassword,
            newPasswordConfirmed
        });

        if (!validationResult.success) {
            const validationErrors = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, {
                message: 'Validation errors.',
                errors: validationErrors
            });
        }

        // If validation passes, update password
        const { error } = await locals.supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return fail(400, { message: error.message });
        }

        // redirect on success
        redirect(303, '/app')
    }
};