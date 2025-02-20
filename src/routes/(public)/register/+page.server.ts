import { authRedirect } from "$lib/supabase-auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const load = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
        throw redirect(303, '/app');
    }
}

export const actions: Actions = {
    register: async ({ request, locals }) => {
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
            const errorMessages = validationResult.error.issues.map(issue => ({
                field: issue.path[0].toString(),
                message: issue.message
            }));

            return fail(400, {
                message: 'Validation errors.',
                errorFields: errorMessages
            });
        }


        // create new user
        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            // Handle specific error codes
            switch (error.status) {
                case 422:
                    return fail(422, {
                        errorFields: [{
                            message: 'Email already registered',
                            field: 'email'
                        }]
                    })
                case 429:
                    return fail(429, {
                        errorFields: [{
                            message: 'Too many requests. Please try again later',
                            field: 'email'
                        },
                        {
                            message: 'Too many requests. Please try again later',
                            field: 'password'
                        }]
                    })

                case 500:
                    return fail(500, {
                        message: 'Server error. Please try again later'
                    })
                default:
                    // Handle unexpected errors
                    return fail(500, {
                        message: 'An unexpected error occurred'
                    })
            }
        }

        // set fullname and any other attribute

        const { error: setProfileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user?.id,
                full_name: fullName,
                updated_at: new Date()
            });

        // redirect
        redirect(303, authRedirect)
    },
}