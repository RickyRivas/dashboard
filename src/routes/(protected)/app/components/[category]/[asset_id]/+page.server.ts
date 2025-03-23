import { error, redirect } from '@sveltejs/kit';
const TABLE = 'code_snippets';
import type { CodeAsset } from '$lib/types';

export async function load({ params, locals: { supabase } }) {
    try {
        const { data, error: sbError } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', params.asset_id)
            .returns<CodeAsset>()
            .single();

        if (sbError) {
            throw error(404, 'Asset not found');
        }

        return {
            codeAsset: data as CodeAsset,
            category: params.category
        };
    } catch (err) {
        redirect(303, '/components')
    }
}