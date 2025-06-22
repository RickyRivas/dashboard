import { json } from "@sveltejs/kit";
import path from 'node:path';
import imageSize from 'image-size';
import { promises as fs } from "node:fs";

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Recursively get all files and folders from a directory
 */
async function getFilesAndFolders(dirPath, basePath, localHostPath) {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const result = [];

        // Process each entry in parallel
        const entriesPromises = entries.map(async (entry) => {
            const entryPath = path.join(dirPath, entry.name);
            const relativePath = entryPath.replace(basePath, '');
            const urlPath = entryPath.replace(basePath, localHostPath);
            // const systemPath =

            // Get common stats for both files and directories
            const stats = await fs.stat(entryPath);

            if (entry.isDirectory()) {
                // It's a directory, recursively process it
                const children = await getFilesAndFolders(entryPath, basePath, localHostPath);

                // console.log(path.join(entryPath, entry.name))


                return {
                    name: entry.name,
                    type: 'directory',
                    relativePath,
                    urlPath,
                    size: formatBytes(stats.size),
                    lastModified: stats.mtime,
                    children,
                    parentFolder: entryPath,
                };
            } else {
                // It's a file, get additional file info
                const { name, base, ext } = path.parse(entry.name);

                // Skip hidden files
                if (name.startsWith('.')) {
                    return null;
                }

                let dimensions = { width: null, height: null };

                // Get dimensions if it's an image
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
                if (imageExtensions.includes(ext.toLowerCase())) {
                    try {
                        const buffer = await fs.readFile(entryPath);
                        dimensions = imageSize(buffer);
                    } catch (err) {
                        // console.warn(`Could not get dimensions for ${entryPath}`, err);
                    }
                }

                return {
                    name,
                    base,
                    type: 'file',
                    ext,
                    relativePath,
                    dashboardSrc: urlPath.replace('www/', ''),
                    urlPath,
                    fileWidth: dimensions.width,
                    fileHeight: dimensions.height,
                    fileSize: formatBytes(stats.size),
                    lastModified: stats.mtime,
                    systemPath: entryPath
                };
            }
        });

        // Wait for all entries to be processed
        const entriesResults = await Promise.all(entriesPromises);

        const priorityFolderNames = ['images', 'uploads', 'spotlight']

        // Filter out null entries (hidden files) & sort
        return entriesResults
            .filter(entry => entry !== null)
            // show files & then directories
            .sort((a, b) => {
                // If types are different, files come before directories
                if (a.type !== b.type) {
                    return a.type === 'directory' ? 1 : -1;
                }
                // If both are directories, check if either is a priority folder
                else if (a.type === 'directory' && b.type === 'directory') {
                    const aIsPriority = priorityFolderNames.includes(a.name);
                    const bIsPriority = priorityFolderNames.includes(b.name);

                    if (aIsPriority && !bIsPriority) return -1;
                    if (!aIsPriority && bIsPriority) return 1;
                }
                // Default to alphabetical sorting
                return a.name.localeCompare(b.name);
            });
    } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error);
        return [];
    }
}

export async function POST({ request }) {
    const { account } = await request.json()

    if (!account) {
        return new Response(JSON.stringify({ error: 'Invalid Credentials' }), { status: 400 });
    }

    const mampPath = '/Applications/MAMP/www';
    const localHostPath = 'http://localhost:8888';
    const currentBuildPath = path.join(mampPath, account, 'www', 'assets');

    try {
        // Get all files and directories recursively
        const fileTree = await getFilesAndFolders(
            currentBuildPath,
            mampPath,
            localHostPath
        );

        // Flatten the file tree to get just the images if needed
        const allImages = [];

        function extractImages(items) {
            items.forEach(item => {
                if (item.type === 'file' && item.fileWidth && item.fileHeight) {
                    allImages.push(item);
                } else if (item.type === 'directory' && item.children) {
                    extractImages(item.children);
                }
            });
        }

        extractImages(fileTree);

        return json({
            imagesDirectory: {
                type: 'directory',
                topLevel: true,
                children: fileTree
            }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to process images' }), { status: 500 });
    }
}