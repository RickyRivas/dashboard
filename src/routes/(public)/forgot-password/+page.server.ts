import { authRedirect } from "$lib/supabase-auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    passwordResetRequest: async ({ url, request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string

        // validate fields
        const emailSchema = z
            .object({
                email: z.string()
                    .email("Please enter a valid email address")
                    .min(5, "Email must be at least 5 characters")
                    .max(64, "Email cannot exceed 64 characters"),
            })

        const validationResult = emailSchema.safeParse({ email });
        if (!validationResult.success) {
            const validationErrors = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, { errors: validationErrors });
        }

        // send reset request
        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            { redirectTo: `${url.origin}/reset-password` }
        );

        if (error) {
            return fail(400, { message: 'Failed to send reset password email' });
        }

        redirect(303, authRedirect)
    }
}