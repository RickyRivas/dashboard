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

// prefixes

const mampPrefix = '/Applications/MAMP/www/';
const localHostPrefix = 'http://localhost:8888';

const systemPathToUrl = (systemPath: string) => {
    // from "/Applications/MAMP/www/account/www/assets/images/logo.svg"
    // to "http://localhost:8888/account/assets/images/logo.svg"
    if (!systemPath.startsWith(mampPrefix)) {
        throw new Error('Invalid system path: must start with MAMP www directory');
    }

    // Remove the prefix and get the relative path
    const relativePath = systemPath.replace(mampPrefix, '');

    // Remove the 'www/' part from the path if it exists
    const urlPath = relativePath.replace(/^([^/]+\/)?www\//, '');

    // Combine with base URL
    return `${localHostPrefix}/${relativePath.split('/')[0]}/${urlPath}`;
};

/**
 * Recursively get all files and folders from a directory
 */
async function getFilesAndFolders(startingPoint: string, account: string) {
    try {
        // fetch all folders under the starting point
        const entries = await fs.readdir(startingPoint, { withFileTypes: true });

        // Process each entry in parallel
        const entriesPromises = entries.map(async (entry) => {
            // Skip hidden files
            if (entry.name.startsWith('.')) return null;

            const parentPath = entry.path
            const entryPath = `${parentPath}/${entry.name}`
            const entryStats = await fs.stat(entryPath);
            let result = {}

            // Get common stats for both files and directories
            result.name = entry.name
            result.type = entry.isDirectory() ? 'directory' : 'file'
            result.size = entryStats ? formatBytes(entryStats.size) : 0
            result.path = entryPath
            result.parentPath = parentPath
            result.lastModified = entryStats.mtime

            if (entry.isDirectory()) {
                // folders
                const children = await getFilesAndFolders(entryPath, account);
                result.children = children
            } else {
                // files
                const { name, base, ext } = path.parse(entry.name);
                result.name = name
                result.ext = ext
                result.base = base

                if (ext && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'].includes(ext.toLowerCase())) {
                    const buffer = await fs.readFile(entryPath);
                    if (buffer) {
                        result.dimensions = imageSize(buffer);
                        result.markupSrc = entry.path.replace(`${mampPrefix}${account}/www`, "") + `/${name}${ext}`
                    }

                }

                // for display purposes in dashboard
                result.siteManagerLocalHostURL = systemPathToUrl(entryPath)
            }

            return result
        });

        // Wait for all entries to be processed and sort them. files then folders
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
    if (!account) return json({ error: 'Invalid Credentials' }, { status: 400 })

    const startingPoint = `/Applications/MAMP/www/${account}/www/assets`

    try {
        // Get all files and directories recursively
        const fileTree = await getFilesAndFolders(startingPoint, account);

        return json({
            imagesDirectory: {
                type: 'directory',
                topLevel: true,
                children: fileTree,
                path: startingPoint
            }
        })

    } catch (error) {
        return json({ error: 'Failed to process images' }, { status: 500 });
    }
}