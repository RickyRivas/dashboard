import type { PageServerLoad } from "../$types";
import type { CodeAsset } from '$lib/types';
import { extractCategoriesAndCounts } from "$lib/utils";
import { error } from "@sveltejs/kit";

const TABLE = 'code_snippets';
const ASSET_TYPE = 'section';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const [assetsResponse, categoriesResponse] = await Promise.all([
        // Get code assets for the current category
        supabase
            .from('code_snippets')
            .select('*')
            .eq('type', ASSET_TYPE)
            .returns<CodeAsset[]>(),

        // Fetch all unique categories
        supabase.from(TABLE)
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

    return { catsAndCounts: extractCategoriesAndCounts(categoriesResponse.data), codeAssets: assetsResponse.data };
};