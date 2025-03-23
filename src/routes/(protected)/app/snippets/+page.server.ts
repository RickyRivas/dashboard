import type { PageServerLoad } from "../$types";
import type { CodeAsset } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.from('code_snippets').select('*').eq('type', 'snippet').returns<CodeAsset[]>()

    if (error) {
        return { codeAssets: [] as CodeAsset[] };
    }

    return { codeAssets: data as CodeAsset[] };
};