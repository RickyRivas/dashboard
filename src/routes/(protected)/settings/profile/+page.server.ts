import { fail, type Actions } from "@sveltejs/kit";
import { z } from 'zod'

export const actions: Actions = {
    updateProfile: async ({ url, request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData()

        const avatar_url = formData.get('avatar_url') as string
        const full_name = formData.get('full_name') as string
        // const username = formData.get('username') as string
        const email = formData.get('email') as string

        // validation
        const FormData = z.object({
            // avatar_url: z.string().min(2),
            full_name: z.string().min(2),
            // username: z.string().min(2),
            email: z.string().email(),
        })

        const validationResult = FormData.safeParse({
            // avatar_url,
            full_name,
            // username,
            email
        })

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, {
                message: 'Please check your info.',
                validationErrors: errorMessages
            });
        }

        // save profile data
        const { session } = await safeGetSession()

        try {
            const { data: currentProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user.id)
                .single()

            if (profileError) {
                return fail(500, {
                    message: 'Failed to fetch current profile',
                    errorFields: []
                })
            }

            // Check if any values have changed
            const hasProfileChanges =
                avatar_url !== currentProfile.avatar_url ||
                full_name !== currentProfile.full_name

            const hasEmailChanged = email !== session?.user.email;

            // If nothing changed, return early
            if (!hasProfileChanges && !hasEmailChanged) {
                return {
                    message: 'No changes detected'
                };
            }

            // handle email change if needed
            if (hasEmailChanged) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: email,
                }, {
                    emailRedirectTo: `${url.origin}/auth/confirm`
                })

                if (emailError) {
                    return fail(400, {
                        errorFields: [{ field: 'email', message: 'Failed to update email.' }]
                    });
                }
            }

            // Update profile if there are changes
            if (hasProfileChanges) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: session?.user.id,
                        full_name,
                        avatar_url,
                        updated_at: new Date()
                    });

                if (updateError) {
                    return fail(400, {
                        errorFields: [{ field: 'full_name', message: 'Failed to update profile' }, { field: 'avatar_url', message: 'Failed to update profile' }]
                    });
                }
            }

            return {
                message: hasEmailChanged
                    ? 'Profile updated. Please check your email to confirm the email change.'
                    : 'Profile updated successfully'
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return fail(500, {
                message: 'An unexpected error occurred',
                errorFields: []
            });
        }
    },
    sendPasswordResetRequest: async ({ url, locals: { supabase, safeGetSession } }) => {
        try {
            const { session } = await safeGetSession();

            if (!session) {
                return fail(401, {
                    message: 'You must be logged in to reset your password'
                });
            }

            const { error } = await supabase.auth.resetPasswordForEmail(
                session.user.email,
                { redirectTo: `${url.origin}${resetPasswordRedirect}` }
            );

            if (error) {
                console.error('Reset password error:', error);
                return fail(400, {
                    message: 'Failed to send reset password email',
                    errorFields: []
                });
            }

            return {
                message: 'Password reset email sent. Please check your inbox.'
            };

        } catch (err) {
            return fail(500, {
                message: 'An unexpected error occurred',
                errorFields: []
            });
        }
    }
};