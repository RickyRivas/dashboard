import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
    const { session, user } = await locals.safeGetSession()
    const { theme } = locals
    return { session, theme, user, cookies: cookies.getAll() }
}