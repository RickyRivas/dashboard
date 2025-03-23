import { extractCategoriesAndCounts } from '$lib/utils/index.js';
import { error, redirect } from '@sveltejs/kit';
import type { CodeAsset } from '$lib/types';

const TABLE = 'code_snippets';
const ASSET_TYPE = 'section';

export async function load({ params, locals: { supabase } }) {
    if (!params.category) {
        redirect(303, '/app/sections');
    }

    try {
        const [assetsResponse, categoriesResponse] = await Promise.all([
            // Get code assets for the current category
            supabase
                .from(TABLE)
                .select('*')
                .eq('type', ASSET_TYPE)
                .eq('category', params.category)
                .returns<CodeAsset[]>(),

            // Fetch all unique categories
            supabase
                .from(TABLE)
                .select('category')
                .eq('type', ASSET_TYPE)
                .order('category')
        ]);

        if (assetsResponse.error) {
            throw error(500, 'Failed to load assets');
        }

        if (categoriesResponse.error) {
            throw error(500, 'Failed to load categories');
        }

        return {
            catsAndCounts: extractCategoriesAndCounts(categoriesResponse.data),
            category: params.category,
            codeAssets: assetsResponse.data
        };
    } catch (err) {
        redirect(303, '/app/sections');
    }
}