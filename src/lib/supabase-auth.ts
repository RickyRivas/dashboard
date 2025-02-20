// redirect url upon successful login/register
export const authRedirect = '/app'
export const resetPasswordRedirect = '/reset-password'

interface AppMetadata {
    provider: string;
    providers: string[];
}

interface UserMetadata {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
}

interface IdentityData {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
}

interface Identity {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: IdentityData;
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
}

export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    new_email: string | null;
    email_change_sent_at: string | null;
    last_sign_in_at: string;
    app_metadata: AppMetadata;
    user_metadata: UserMetadata;
    identities: Identity[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
}

export interface Profile {
    avatar_url: string | null;
    full_name: string | null;
    id: string;
    updated_at: string | null;
    username: string | null;
    website: string | null;
}
