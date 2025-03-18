import { authRedirect } from "$lib/supabase-auth";
import { forgotPasswordSchema } from "$lib/zod-helper";
import { validateForm } from "$lib/zod-helper";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    passwordResetRequest: async ({ url, request, locals: { supabase } }) => {
        try {
            const formData = await request.formData()
            const email = formData.get('email') as string

            const validateFormResult = await validateForm(forgotPasswordSchema, { email })
            if (validateFormResult.errors) return fail(400, { errors: validateFormResult.errors });

            const { error } = await supabase.auth.resetPasswordForEmail(
                email,
                { redirectTo: `${url.origin}/reset-password` }
            );

            if (error) return fail(400, { message: error.message });
            return { success: true, redirectTo: authRedirect }
        } catch (e) {
            return fail(500, { message: 'An unexpected error occurred. Please try again later.' })
        }
    }
}