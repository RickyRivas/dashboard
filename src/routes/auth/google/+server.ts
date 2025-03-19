import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${url.origin}/auth/confirm?next=/app`
        }
    })

    if (error) return json({ error: 'Failed to initiate authentication.' }, { status: 500 });
    throw redirect(303, data.url)
};