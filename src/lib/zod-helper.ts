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