import type { CodeAsset } from "$lib/types"

export function extractFavorites(codeAssets: CodeAsset[]) {
    return (
        codeAssets
            // filter every component that is a favorite
            .filter((codeAsset) => codeAsset.favorite === true)
            // return the favorited object
            .map((codeAsset) => ({ ...codeAsset }))
            .sort((a, b) => {
                // sort alphabetically
                if (a.category < b.category) {
                    return -1
                } if (a.category > b.category) {
                    return 1
                }
                return 0
            })
    )
}

export function groupByCategory(codeAssets: CodeAsset[]) {
    const categoryMap = new Map()

    codeAssets.forEach((codeAsset) => {
        const category = codeAsset.category

        if (!categoryMap.has(category)) {
            categoryMap.set(category, [])
        }

        categoryMap.get(category).push(codeAsset)
    })

    const groupedSnippets = Array.from(categoryMap, ([category, codeAssets]) => ({
        category,
        codeAssets,
    }))
        .sort((a, b) => {
            // sort alphabetically
            if (a.category < b.category) {
                return -1
            } if (a.category > b.category) {
                return 1
            }
            return 0
        })

    return groupedSnippets
}

export function extractCategoriesAndCounts(categories) {
    const counts = categories.reduce((acc, item) => {
        // reassigning obj key 'category' to a count. setting count at 0 and upping it by 1
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
    }, {})

    return Object.entries(counts).map(([category, count]) => (
        { category, count }
    ))
}