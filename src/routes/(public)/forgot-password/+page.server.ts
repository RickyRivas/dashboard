import { authRedirect, resetPasswordRedirect } from "$lib/supabase-auth";
import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    passwordResetRequest: async ({ url, request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string

        const emailSchema = z
            .object({
                email: z.string()
                    .email("Please enter a valid email address")
                    .min(5, "Email must be at least 5 characters")
                    .max(64, "Email cannot exceed 64 characters"),
            })

        // validate fields
        const validationResult = emailSchema.safeParse({
            email,
        });

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, {
                message: 'Validation errors.',
                validationErrors: errorMessages
            });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            { redirectTo: `${url.origin}${resetPasswordRedirect}` }
        );

        if (error) {
            console.error('Reset password error:', error);
            return fail(400, {
                message: 'Failed to send reset password email',
                errorFields: []
            });
        }

        redirect(303, authRedirect)
    }
}