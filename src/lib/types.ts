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

export type FileItem = {
    name: string;
    base: string;
    type: "file" | "directory";
    ext: string;
    relativePath: string;
    dashboardSrc: string;
    urlPath: string;
    fileWidth: number | null;
    fileHeight: number | null;
    fileSize: string;
    lastModified: string | Date;
    // Add this property for directories
    children?: FileItem[];
};