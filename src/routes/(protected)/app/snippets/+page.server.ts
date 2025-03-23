import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.from('code_snippets').select('*').eq('type', 'snippet')
    if (error) return { codeAssets: data }
    else return { codeAssets: data }
};