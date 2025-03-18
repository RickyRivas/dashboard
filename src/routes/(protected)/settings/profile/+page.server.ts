import { deleteUserSchema, profileSchema, validateForm } from "$lib/zod-helper";
import type { Provider, UserIdentity } from "@supabase/supabase-js";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    updateProfile: async ({ url, request, locals: { supabase, safeGetSession } }) => {
        // save profile data
        const { user } = await safeGetSession();
        const formData = await request.formData();
        const oauthOnly = formData.get('oauth-only') as string;

        const avatar_url = formData.get('avatar_url');
        const full_name = formData.get('full_name')
        const email = oauthOnly ? user.email : formData.get('email')

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
    },
    sendPasswordResetRequest: async ({ url, locals: { supabase, safeGetSession } }) => {
        const { user } = await safeGetSession();
        const { error } = await supabase.auth.resetPasswordForEmail(
            user.email as string,
            { redirectTo: `${url.origin}/reset-password` }
        );

        if (error) return fail(error.status as number, { message: 'Failed to send request' });

        return { success: true };
    },
    deleteAccount: async ({ request, locals: {
        supabase, supabaseServiceRole, safeGetSession
    } }) => {
        const { user } = await safeGetSession()
        const formData = await request.formData()
        const confirm = formData.get('confirm')
        const validateFormResult = await validateForm(deleteUserSchema, { confirm })

        if (validateFormResult.errors) return fail(400, { message: 'Form validation failure.', errors: validateFormResult.errors });

        const { error } = await supabaseServiceRole.auth.admin.deleteUser(
            user.id,
            true,
        )

        if (error) return fail(error.status as number, { message: "There was an error deleting your account." })

        await supabase.auth.signOut()
        redirect(303, "/")
    },
    linkProvider: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const providerToLinkTo = formData.get('provider') as Provider

        const { data, error } = await supabase.auth.linkIdentity({
            provider: providerToLinkTo
        })

        if (error) return fail(error.status as number, { message: 'Failed to link to provider.' })
        else throw redirect(303, data.url)
    },
    unlinkProvider: async ({ request, locals: { supabase, safeGetSession, supabaseServiceRole } }) => {
        // we only get this far if the user chooses to 'unlink' from a oauth provider
        const { user } = await safeGetSession()
        if (!user?.id) throw redirect(303, "/login")

        const formData = await request.formData()
        const providerToUnlinkTo = formData.get('provider') as Provider
        const identities = await supabase.auth.getUserIdentities()
        const foundIdentity = identities.data?.identities.find(
            identity => identity.provider === providerToUnlinkTo
        ) as UserIdentity

        const { error } = await supabase.auth.unlinkIdentity(foundIdentity)

        if (error) {
            // if user has only signed up with oauth, extract from and set the email provider, and then unlink.
            if (error.code === 'single_identity_not_deletable') {
                const oauthIdentityEmail = foundIdentity?.identity_data?.email

                if (oauthIdentityEmail) {
                    const { error: updateupdateEmailError } = await supabaseServiceRole.auth.admin.updateUserById(
                        user?.id,
                        { email: foundIdentity?.identity_data?.email }
                    )

                    if (updateupdateEmailError) fail(updateupdateEmailError.status as number, { message: 'Something went wrong.' })

                    // retry unlink 
                    const { error } = await supabase.auth.unlinkIdentity(foundIdentity)
                    if (updateupdateEmailError) fail(error?.status as number, { message: error?.message })
                    else throw redirect(303, '/auth/confirm?next=/settings/profile')
                }
            }

            // other
            return fail(error.status as number, { message: error.message })
        }

        else throw redirect(303, '/auth/confirm?next=/settings/profile')
    }
};