export type CodeAsset = {
    id: string;
    title: string;
    description: string;
    type: "snippet" | "component" | "section";
    html: string;
    css: string;
    javascript: string;
    thumbnailurl: string;
    category: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
    buildtime: string | null;
}