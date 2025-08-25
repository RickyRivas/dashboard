import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const { supabase } = locals
    const trackerTable = 'build_tracker';
    const { data, error } = await supabase.from(trackerTable).select('*').single();

    return { account: data }
}