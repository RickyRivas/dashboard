import { json } from '@sveltejs/kit'
import path from 'path';
import fs from 'fs/promises';
import imageSize from 'image-size';

const mampPrefix = '/applications/mamp/www/';
const localHostPrefix = 'http://localhost:8888';
const imgTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']

export async function GET({ url }) {
    try {
        const parentId = url.searchParams.get('parentid') ?? ""
        const directory = url.searchParams.get('directory') ?? ""
        const fullPath = path.join(directory, decodeURIComponent(parentId));
        const files = await scanDirectory(fullPath, decodeURIComponent(parentId))
        return json(files);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

// POST /api/files/[parentid] - Create files & folders
export async function POST({ request, url }) {
    try {
        console.log('post call', request)
        const data = await request.json()
        console.log('post call data', data)

        if (!data.name && !data.type) return new Response('file name & type required.', { status: 400 });

        const name = decodeURIComponent(data.name)
        const type = data.type
        const parentId = decodeURIComponent(url.searchParams.get('parentid') ?? "");
        const directory = url.searchParams.get('directory') as string
        const parentPath = path.join(directory, parentId)

        // console.log('post call', url)

        if (type === 'folder') {
            const newFolderPath = path.join(directory, parentId, name);
            await fs.mkdir(newFolderPath, { recursive: true });
            const virtualId = parentId ? `/${parentId}/${name}` : `/${name}`;

            return json({
                result: {
                    id: virtualId,
                    type: 'folder',
                    name,
                    date: new Date()
                }
            });
        }

        if (type === 'file') {
            // create empty file
            const newFilePath = path.join(parentPath, name)

            // ensure parent directory exisits
            await fs.mkdir(parentPath, { recursive: true })

            // create empty file
            await fs.writeFile(newFilePath, "")

            const virtualId = parentId ? `/${parentId}/${name}` : `/${name}`;
            const stats = await fs.stat(newFilePath)

            return json({
                result: {
                    id: virtualId,
                    type: 'file',
                    name,
                    size: stats.size,
                    date: stats.mtime
                }
            })
        }

        return json({ error: 'Invalid type. Must be "file" or "folder"' }, { status: 400 });
    } catch (error) {
        console.error('File creation error:', error);
        return json({
            error: error.code === 'EEXIST' ? 'File or folder already exists' : 'Failed to create file/folder'
        }, { status: 500 });
    }
}

// PUT /api/files/[id] - Rename/Move operations
export async function PUT({ url, request }) {
    try {
        const id = decodeURIComponent(url.searchParams.get('parentid') ?? "");
        const body = await request.json();
        const directory = url.searchParams.get('directory') as string

        if (body.operation === 'rename') {
            const oldPath = path.join(directory, id);
            const newPath = path.join(path.dirname(oldPath), body.name);

            await fs.rename(oldPath, newPath);

            const newVirtualId = `/${path.relative(directory, newPath).replace(/\\/g, '/')}`;

            return json({
                result: {
                    id: newVirtualId
                }
            });
        } else if (body.operation === 'move') {
            const { ids, target } = body;
            const results = [];

            for (const id of ids) {
                const sourcePath = path.join(directory, id);
                const fileName = path.basename(sourcePath);
                const targetPath = path.join(directory, target, fileName);

                // Check if target already exists
                if (await fileExists(targetPath)) {
                    return json({
                        error: 'Target already exists',
                        code: 'CONFLICT',
                        conflictingFile: fileName
                    }, { status: 409 });
                }

                // Ensure target directory exists
                await fs.mkdir(path.dirname(targetPath), { recursive: true });

                // Move the file/folder
                await fs.rename(sourcePath, targetPath);

                const newVirtualId = target ? `/${target}/${fileName}` : `/${fileName}`;
                results.push({ id: newVirtualId });
            }

            return json({ result: results });

        } else if (body.operation === 'copy') {
            const { ids, target } = body;
            const results = [];

            for (const id of ids) {
                const sourcePath = path.join(directory, id);
                const fileName = path.basename(sourcePath);
                const targetPath = path.join(directory, target, fileName);

                // Check if target already exists
                if (await fileExists(targetPath)) {
                    return json({
                        error: 'Target already exists',
                        code: 'CONFLICT',
                        conflictingFile: fileName
                    }, { status: 409 });
                }

                // Ensure target directory exists
                await fs.mkdir(path.dirname(targetPath), { recursive: true });

                // Copy file or directory
                await copyFileOrDirectory(sourcePath, targetPath);

                const newVirtualId = target ? `/${target}/${fileName}` : `/${fileName}`;
                results.push({ id: newVirtualId });
            }

            return json({ result: results });
        }

        return json({ error: 'Invalid operation' }, { status: 400 });
    } catch (error) {
        return json({ error: 'Operation failed' }, { status: 500 });
    }
}

// DELETE /api/files - Delete files
export async function DELETE({ request, url }) {
    try {
        const body = await request.json();
        const { ids } = body;
        const directory = url.searchParams.get('directory') as string

        for (const id of ids) {
            const filePath = path.join(directory, id);
            await fs.rm(filePath, { recursive: true, force: true });
        }

        return json({ result: 'success' });
    } catch (error) {
        return json({ error: 'Delete failed' }, { status: 500 });
    }
}

// helpers

async function scanDirectory(dirPath, virtualPath = '') {
    const files = [];

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            // Skip hidden files
            if (entry.name.startsWith('.')) continue;

            const realPath = path.join(dirPath, entry.name);

            const virtualId = virtualPath
                ? `${virtualPath}/${entry.name}`
                : `/${entry.name}`;

            if (entry.isDirectory()) {
                const subEntries = await fs.readdir(realPath);
                const stats = await fs.stat(realPath);

                files.push({
                    id: virtualId,
                    type: 'folder',
                    value: entry.name,
                    date: stats.mtime,
                    count: subEntries.length,
                    lazy: true,
                    relativePath: realPath,
                });
            } else if (entry.isFile()) {
                const stats = await fs.stat(realPath);

                // if image type get dimensions
                const { ext } = path.parse(entry.name);

                let imageDimensions

                if (ext && imgTypes.includes(ext.toLowerCase())) {
                    const buffer = await fs.readFile(realPath);
                    if (buffer) {
                        imageDimensions = imageSize(buffer);
                        imageDimensions.size = formatBytes(stats.size)
                    }
                }

                files.push({
                    id: virtualId,
                    type: 'file',
                    value: entry.name,
                    date: stats.mtime,
                    size: stats.size,
                    relativePath: realPath,
                    localHostPath: systemPathToUrl(realPath),
                    imageDimensions
                });
            }
        }
    } catch (error) {
        console.error('Error scanning directory:', error);
        return json({ message: error.message }, { status: 500 })
    }

    return files;
}


async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function copyFileOrDirectory(source, destination) {
    const stats = await fs.stat(source);

    if (stats.isFile()) {
        await fs.copyFile(source, destination);
    } else if (stats.isDirectory()) {
        await fs.mkdir(destination, { recursive: true });

        const entries = await fs.readdir(source, { withFileTypes: true });

        for (const entry of entries) {
            const sourcePath = path.join(source, entry.name);
            const destPath = path.join(destination, entry.name);

            await copyFileOrDirectory(sourcePath, destPath);
        }
    }
}

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

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};