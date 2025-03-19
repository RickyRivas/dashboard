// See https://svelte.dev/docs/kit/types#app.d.ts
import { Session, SupabaseClient } from "@supabase/supabase-js"

type Theme = 'light' | 'dark';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
			supabaseServiceRole: SupabaseClient<Database>
			safeGetSession: () => Promise<{
				session: Session | null
				user: User | null
			}>
			session: Session | null
			user: User | null
			theme: Theme
		}
		interface PageData {
			session: Session | null
			theme?: Theme
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { }