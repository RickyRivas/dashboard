import type { PageServerLoad } from "../$types";

const libraryTable = 'code_snippets'

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
    const requestedType = url.searchParams.get('type') || "snippet"
    let requestedCategory = url.searchParams.get('category') || ''

    // 1. Get all categories for type
    const { data: typeCategories, error: typeCategoriesError } = await supabase
        .from(libraryTable)
        .select('category')
        .eq('type, ', requestedType)
        .order('category', { ascending: true })

    const typeCategoriesMap = [...new Set(typeCategories?.map(o => o.category))]

    if (!requestedCategory && typeCategoriesMap.length) requestedCategory = typeCategoriesMap[0]

    // 2. fetch data in default or requested category
    const { data: requestedCodeAssets, error: requestedCodeAssetsError } = await supabase
        .from(libraryTable)
        .select('*')
        .eq('category', requestedCategory)
        .eq('type', requestedType)

    // // 3. get favorite snippets and local data
    // const { data: favoriteSnippets, error: favoriteSnippetsError } = await supabase
    //     .from(libraryTable)
    //     .select("*")
    //     .eq('type', 'snippet')
    //     .eq('favorite', true)
    //     .order('title', { ascending: true })

    return { type: requestedType, category: requestedCategory, categories: typeCategoriesMap, assets: requestedCodeAssets }
}