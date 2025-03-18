import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { validateForm } from "$lib/zod-helper";
import { registerNewUserSchema } from "$lib/zod-helper";
import { avatarPlaceholderPath } from "$lib/auth-controller";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, '/app');
    }
}

export const actions: Actions = {
    register: async ({ request, locals: { supabase }, url }) => {
        try {
            const formData = await request.formData();
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const passwordConfirmed = formData.get('passwordConfirmed') as string;
            const fullName = formData.get('fullName') as string;

            const validateFormResult = await validateForm(registerNewUserSchema, {
                fullName,
                email,
                password,
                passwordConfirmed,
            })

            if (validateFormResult.errors) return fail(400, { errors: validateFormResult.errors });

            // create new user. user will need to confirm their email
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        avatar_url: avatarPlaceholderPath
                    },
                    // redirect to after user confirms email
                    emailRedirectTo: `${url.origin}/auth/confirm`
                }
            })

            if (error) return fail(error.status as number, { message: error.message })

            // Check if this is an existing user
            if (data?.user?.role === '' || !data?.user?.user_metadata?.sub || data?.user?.identities?.length === 0) {
                return { success: true, redirectTo: `/verify-email?email=${data.user?.email}&existing=true` }
            } else {
                return { success: true, redirectTo: `/verify-email?email=${data.user?.user_metadata.email}&name=${data.user?.user_metadata.full_name}` }
            }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    }
}
