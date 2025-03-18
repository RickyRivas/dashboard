import { deleteUserSchema, profileSchema, validateForm } from "$lib/zod-helper";
import type { Provider, UserIdentity } from "@supabase/supabase-js";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    updateProfile: async ({ url, request, locals: { supabase, safeGetSession } }) => {
        try {
            // save profile data
            const { user } = await safeGetSession();

            const { data: fetchedUserIdentities, error: fetchedUserIdentitiesError } = await supabase.auth.getUserIdentities()

            const hasEmailAuthentication = fetchedUserIdentities?.identities.some(
                (provider) => provider.provider === 'email'
            ) || null;

            const formData = await request.formData();
            const avatar_url = formData.get('avatar_url');
            const full_name = formData.get('full_name')
            const email = !hasEmailAuthentication ? user.email : formData.get('email')

            const validateFormResult = await validateForm(profileSchema, { avatar_url, full_name, email })
            if (validateFormResult.errors) return fail(400, { message: 'Form validation failure.', errors: validateFormResult.errors });

            const { data: fetchedProfile, error: failedProfileFetch } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (failedProfileFetch) return fail(500, { message: 'Failed to update profile.', errors: [] })

            // Check if any values have changed
            const hasProfileChanges =
                avatar_url !== fetchedProfile.avatar_url ||
                full_name !== fetchedProfile.full_name

            const hasEmailChanged = email !== user.email;

            // If nothing changed, return early
            if (!hasProfileChanges && !hasEmailChanged) return { success: true };

            // handle email change if needed
            if (hasEmailChanged) {
                const { error } = await supabase.auth.updateUser({
                    email: email
                }, {
                    emailRedirectTo: `${url.origin}/auth/confirm`
                })

                if (error) return fail(error.status as number, { errors: [{ field: 'email', message: 'Failed to update email.' }] });
            }

            // Update profile if there are changes
            if (hasProfileChanges) {
                const { error: updateProfileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name,
                        avatar_url,
                        updated_at: new Date()
                    });

                if (updateProfileError) return fail(400, { message: 'Failed to update profile.' });
            }

            return { success: true }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    },
    sendPasswordResetRequest: async ({ url, locals: { supabase, safeGetSession } }) => {
        try {
            const { user } = await safeGetSession();
            const { error } = await supabase.auth.resetPasswordForEmail(
                user.email as string,
                { redirectTo: `${url.origin}/reset-password` }
            );

            if (error) return fail(error.status as number, { message: 'Failed to send request' });

            return { success: true };
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    },
    deleteAccount: async ({ request, locals: {
        supabase, supabaseServiceRole, safeGetSession
    } }) => {
        try {
            const { user } = await safeGetSession()
            const formData = await request.formData()
            const confirm = formData.get('confirm')

            const validateFormResult = await validateForm(deleteUserSchema, { confirm })
            if (validateFormResult.errors) return fail(400, { errors: validateFormResult.errors });

            const { error } = await supabaseServiceRole.auth.admin.deleteUser(
                user.id,
                true,
            )

            if (error) return fail(error.status as number, { message: "There was an error deleting your account." })

            await supabase.auth.signOut()
            return { success: true, redirectTo: '/' }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    },
    linkProvider: async ({ request, locals: { supabase } }) => {
        try {
            const formData = await request.formData()
            const providerToLinkTo = formData.get('provider') as Provider

            const { data, error } = await supabase.auth.linkIdentity({
                provider: providerToLinkTo
            })

            if (error) {
                return fail(error.status || 400, {
                    message: error.message || 'Failed to link provider',
                    provider: providerToLinkTo
                });
            }

            if (data && data.url) {
                return { success: true, redirectTo: data.url }
            }

            return fail(500, {
                message: 'Authentication service did not provide a redirect URL',
                provider: providerToLinkTo
            });
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    },
    unlinkProvider: async ({ request, locals: { supabase, safeGetSession, supabaseServiceRole } }) => {
        try {
            // we only get this far if the user chooses to 'unlink' from a oauth provider
            const { user } = await safeGetSession()
            if (!user?.id) throw redirect(303, "/login")

            const formData = await request.formData()
            const providerToUnlink = formData.get('provider') as Provider
            const identities = await supabase.auth.getUserIdentities()
            if (!identities.data?.identities?.length) {
                return fail(400, { message: 'No linked identities found.' })
            }

            const foundIdentity = identities.data?.identities.find(
                identity => identity.provider === providerToUnlink
            ) as UserIdentity
            if (!foundIdentity) {
                return fail(404, { message: `No ${providerToUnlink} identity found.` })
            }

            const { error } = await supabase.auth.unlinkIdentity(foundIdentity)

            if (error) {
                // if user has only signed up with oauth, extract from and set the email provider, and then unlink.
                if (error.code === 'single_identity_not_deletable') {
                    const oauthIdentityEmail = foundIdentity?.identity_data?.email

                    if (oauthIdentityEmail) {
                        const { error: updateEmailError } = await supabaseServiceRole.auth.admin.updateUserById(
                            user?.id,
                            { email: foundIdentity?.identity_data?.email }
                        )

                        if (updateEmailError) {
                            return fail(updateEmailError.status as number, {
                                message: 'Failed to update email authentication.'
                            })
                        }

                        // Retry unlinking now that we have another identity
                        const { error: unlinkError } = await supabase.auth.unlinkIdentity(foundIdentity)

                        if (unlinkError) {
                            return fail(unlinkError.status as number, {
                                message: unlinkError.message || 'Failed to unlink provider.'
                            })
                        }

                        return { success: true, redirectTo: '/auth/confirm?next=/settings/profile' }
                    }
                }

                // other
                return fail(error.status as number, { message: error.message || 'Failed to unlink provider.' })
            }

            return { success: true, redirectTo: '/auth/confirm?next=/settings/profile' }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    }
};