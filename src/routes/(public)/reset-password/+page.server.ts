import { authRedirect } from "$lib/supabase-auth";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { z } from "zod";
// Check for OTP method first(means they came from valid reset link)
// If no OTP but they're logged in (password method), redirect them to settings
// If not logged in at all(empty array), redirect to login

// clicking the reset link from their email will also log them in.
export const load: ServerLoad = async ({ locals }) => {
    const { data: aal } = await locals.supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    // Check for OTP (came from reset link)
    const isOTPVerified = aal?.currentAuthenticationMethods.some(
        method => method.method === 'otp'
    );

    if (!isOTPVerified) {
        // Check if they're logged in normally
        if (aal?.currentAuthenticationMethods.length > 0) {
            throw redirect(303, '/settings?error=Please request a password reset');
        }
        // Not logged in at all
        throw redirect(303, '/login?error=Invalid reset password attempt');
    }

    return {};
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
            const errorMessages = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, {
                message: 'Validation errors.',
                validationErrors: errorMessages
            });
        }

        // If validation passes, update password
        const { error } = await locals.supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            return fail(400, { message: error.message });
        }

        // redirect on success
        redirect(303, authRedirect)
    }
};