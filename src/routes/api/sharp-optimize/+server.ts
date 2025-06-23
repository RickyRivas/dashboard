import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { promises as fs, mkdir, mkdirSync, readdirSync } from "node:fs";
import path from 'node:path';

export async function POST({ request }) {
    const { folder } = await request.json()
    if (!folder || !folder.children.length || !folder.path) return json({ status: 200 })

    // optimize all child files inside passed folder. exclude SVGS
    let folderName = "optimized";
    let counter = 1;
    let newFolderPath = path.join(folder.path, folderName);

    // Check if folder exists and create a unique name
    while (await fs.access(newFolderPath).then(() => true).catch(() => false)) {
        folderName = `optimized-${counter}`;
        newFolderPath = path.join(folder.path, folderName);
        counter++;
    }

    const createdNewFolder = await fs.mkdir(newFolderPath, { recursive: true });
    if (!createdNewFolder) return json({ message: "Unable to create new folder" }, { status: 400 });

    await Promise.all(
        folder.children.map(async (child) => {
            if (child.type === "file" && child.path && ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp', '.gif'].includes(child.ext.toLowerCase())) {
                const outputPath = path.join(newFolderPath, `${child.name}${child.ext}`);

                let sharpInstance = sharp(child.path);

                // Apply aggressive optimization based on format
                if (child.ext === '.jpg' || child.ext === '.jpeg') {
                    sharpInstance = sharpInstance.jpeg({
                        quality: 80,           // Lower quality for smaller size
                        progressive: true,     // Progressive loading
                        mozjpeg: true         // Use mozjpeg encoder (better compression)
                    });
                } else if (child.ext === '.png') {
                    sharpInstance = sharpInstance.png({
                        quality: 80,
                        progressive: true,
                        compressionLevel: 9,   // Maximum PNG compression (0-9)
                        palette: true         // Use palette if possible (smaller for simple images)
                    });
                } else if (child.ext === '.webp') {
                    sharpInstance = sharpInstance.webp({
                        quality: 80,
                        effort: 6             // Maximum compression effort (0-6)
                    });
                }

                await sharpInstance.toFile(outputPath);
            }
        })
    );

    return json({ status: 200 })
}