import { json } from '@sveltejs/kit'
import path from 'path';
import fs from 'fs/promises';

const BASE_DIR = "/applications/mamp/www/doublet-smiles"

// refresh - new data format bug

export async function GET({ url }) {
    try {
        const parentId = url.searchParams.get('parent-id')
        const fullPath = path.join(BASE_DIR, parentId !== null ? decodeURIComponent(parentId) : "");
        const files = await scanDirectory(fullPath, parentId !== null ? decodeURIComponent(parentId) : "")
        return json(files);
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

// POST /api/files/[parent-id] - Create files & folders
export async function POST({ request, url }) {
    try {
        const body = await request.json()
        const name = decodeURIComponent(body.name)
        const type = body.type
        const parentId = url.searchParams.get('parent-id') ? decodeURIComponent(url.searchParams.get('parent-id')) : '';
        const parentPath = path.join(BASE_DIR, parentId)

        if (type === 'folder') {
            const newFolderPath = path.join(BASE_DIR, parentId, name);
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
        const id = decodeURIComponent(url.searchParams.get('parent-id'));
        const body = await request.json();

        if (body.operation === 'rename') {
            const oldPath = path.join(BASE_DIR, id);
            const newPath = path.join(path.dirname(oldPath), body.name);

            await fs.rename(oldPath, newPath);

            const newVirtualId = `/${path.relative(BASE_DIR, newPath).replace(/\\/g, '/')}`;

            return json({
                result: {
                    id: newVirtualId
                }
            });
        } else if (body.operation === 'move') {
            const { ids, target } = body;
            const results = [];

            for (const id of ids) {
                const sourcePath = path.join(BASE_DIR, id);
                const fileName = path.basename(sourcePath);
                const targetPath = path.join(BASE_DIR, target, fileName);

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
                const sourcePath = path.join(BASE_DIR, id);
                const fileName = path.basename(sourcePath);
                const targetPath = path.join(BASE_DIR, target, fileName);

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
export async function DELETE({ request }) {
    try {
        const body = await request.json();
        const { ids } = body;

        for (const id of ids) {
            const filePath = path.join(BASE_DIR, id);
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
            const realPath = path.join(dirPath, entry.name);
            const relativePath = path.join(BASE_DIR, entry.name)
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
                    relativePath
                });
            } else if (entry.isFile()) {
                const stats = await fs.stat(realPath);
                files.push({
                    id: virtualId,
                    type: 'file',
                    value: entry.name,
                    date: stats.mtime,
                    size: stats.size,
                    relativePath
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