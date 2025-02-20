// /auth/callback/+server.ts
import { redirect } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';

export const GET = async ({ url, locals: { supabase } }) => {
    const token_hash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type') as EmailOtpType;
    const next = url.searchParams.get('next') ?? '/';

    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });

        if (!error) {
            // Successful verification, redirect to the password reset page
            if (type === 'recovery') {
                throw redirect(303, '/reset-password');
            }
            // Handle other auth types (signup, etc)
            throw redirect(303, next);
        }
    }

    // Error case
    throw redirect(303, '/');
};