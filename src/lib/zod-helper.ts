import { z } from "zod"

// schemas
export const profileSchema = z.object({
    avatar_url: z.string().min(2),
    full_name: z.string().min(2),
    email: z.string().email(),
})

export const deleteUserSchema = z.object({
    confirm: z.literal('confirm', {
        invalid_type_error: "Please type 'confirm' to delete your account",
        required_error: "Confirmation is required"
    })
})

export const forgotPasswordSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(64, "Email cannot exceed 64 characters"),
})

export const newPasswordSchema = z
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

export const registerNewUserSchema = z
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

export const deleteSiteSchema = z.object({
    confirm: z.literal('confirm', {
        invalid_type_error: "Please type 'confirm' to delete this website.",
        required_error: "Confirmation is required"
    })
})

export async function validateForm(schema, data) {
    const result = schema.safeParse(data)

    if (!result.success) return {
        errors: result.error.issues.map(issue => ({
            field: issue.path[0].toString(),
            message: issue.message
        }))
    }

    return {}
}
