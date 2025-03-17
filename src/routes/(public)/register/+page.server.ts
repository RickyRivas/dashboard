import { fail, redirect, type Actions } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, '/app');
    }
}

export const actions: Actions = {
    register: async ({ request, locals, url }) => {
        const { supabase } = locals;

        const formData = await request.formData();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const passwordConfirmed = formData.get('passwordConfirmed') as string;
        const fullName = formData.get('fullName') as string;

        const registerSchema = z
            .object({
                fullName: z.string()
                    .min(2, "Full name must be at least 2 characters")
                    .max(50, "Full name cannot exceed 50 characters")
                    .regex(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
                email: z.string()
                    .email("Please enter a valid email address")
                    .min(5, "Email must be at least 5 characters")
                    .max(64, "Email cannot exceed 64 characters"),
                password: z.string()
                    .min(6, "Password must be at least 6 characters")
                    .regex(/[A-Z]/, "Must contain uppercase letter")
                    .regex(/[0-9]/, "Must contain number"),
                passwordConfirmed: z.string()
            })
            .refine((data) => data.password === data.passwordConfirmed, {
                message: "Passwords don't match",
                path: ["passwordConfirmed"]
            });

        // validate fields
        const validationResult = registerSchema.safeParse({
            fullName,
            email,
            password,
            passwordConfirmed
        });

        if (!validationResult.success) {
            const validationErrors = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, { errors: validationErrors });
        }

        // create new user. user will need to confirm their email
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                // redirect to after user confirms email
                emailRedirectTo: `${url.origin}/auth/confirm`
            }
        })

        if (error) return fail(error.status as number, { message: error.message })

        // Check if this is an existing user
        if (data?.user?.role === '' ||
            !data?.user?.user_metadata?.sub ||
            data?.user?.identities?.length === 0) {
            throw redirect(303, `/verify-email?email=${data.user?.email}&existing=true`)
        } else {
            throw redirect(303, `/verify-email?email=${data.user?.user_metadata.email}&name=${data.user?.user_metadata.full_name}`)
        }
    },
}


// sign up data with esisting user
// sign up data {
//   user: {
//     id: '25ad1a3c-d15f-4c95-9067-99ce1fc13a9a',
//     aud: 'authenticated',
//     role: '',
//     email: 'email@gmail.com',
//     phone: '',
//     confirmation_sent_at: '2025-03-17T01:55:17.832028764Z',
//     app_metadata: { provider: 'email', providers: [Array] },
//     user_metadata: { full_name: 'xxx' },
//     identities: [],
//     created_at: '2025-03-17T01:55:17.832028764Z',
//     updated_at: '2025-03-17T01:55:17.832028764Z',
//     is_anonymous: false
//   },
//   session: null
// }

// sign up data with real new user
// sign up data {
//   user: {
//     id: '72b64a88-bf95-4122-a06e-ba343b973b08',
//     aud: 'authenticated',
//     role: 'authenticated',
//     email: 'email@gmail.com',
//     phone: '',
//     confirmation_sent_at: '2025-03-17T01:56:20.998772021Z',
//     app_metadata: { provider: 'email', providers: [Array] },
//     user_metadata: {
//       email: 'email@gmail.com',
//       email_verified: false,
//       full_name: 'RIvassss',
//       phone_verified: false,
//       sub: '72b64a88-bf95-4122-a06e-ba343b973b08'
//     },
//     identities: [ [Object] ],
//     created_at: '2025-03-17T01:56:20.954026Z',
//     updated_at: '2025-03-17T01:56:22.234505Z',
//     is_anonymous: false
//   },
//   session: null
// }