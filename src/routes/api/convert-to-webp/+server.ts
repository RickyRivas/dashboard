// src/routes/api/convert-to-webp/+server.ts
import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const quality = parseInt(formData.get('quality') as string) || 80;
        const outputPath = formData.get('outputPath') as string;

        if (!file) {
            return json({ message: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.includes('image/jpeg') && !file.type.includes('image/jpg')) {
            return json({ message: 'Only JPG/JPEG files are supported' }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // If outputPath is provided, save to filesystem
        if (outputPath) {
            const fileName = file.name.replace(/\.(jpg|jpeg)$/i, '.webp');
            const fullOutputPath = path.join(outputPath, fileName);

            await sharp(buffer)
                .webp({

                    quality: quality,
                    effort: 6 // Maximum compression effort (0-6)
                })
                .toFile(fullOutputPath);

            return json({
                message: 'File converted successfully',
                outputPath: fullOutputPath,
                fileName: fileName
            });
        }
        // Otherwise, return the converted image as base64
        else {
            const webpBuffer = await sharp(buffer)
                .webp({
                    quality: quality,
                    effort: 6
                })
                .toBuffer();

            const base64 = webpBuffer.toString('base64');
            const dataUrl = `data:image/webp;base64,${base64}`;

            return json({
                message: 'File converted successfully',
                data: dataUrl,
                size: webpBuffer.length
            });
        }

    } catch (error) {
        console.error('Conversion error:', error);
        return json({ message: 'Failed to convert image' }, { status: 500 });
    }
};

// Batch conversion endpoint
export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { folder, quality = 80 } = await request.json();

        if (!folder || !folder.children?.length || !folder.path) {
            return json({ message: 'Invalid folder data' }, { status: 400 });
        }

        // Create output folder
        let folderName = "webp-converted";
        let counter = 1;
        let newFolderPath = path.join(folder.path, folderName);

        while (await fs.access(newFolderPath).then(() => true).catch(() => false)) {
            folderName = `webp-converted-${counter}`;
            newFolderPath = path.join(folder.path, folderName);
            counter++;
        }

        await fs.mkdir(newFolderPath, { recursive: true });

        const results = await Promise.allSettled(
            folder.children.map(async (child) => {
                if (child.type === "file" && child.path &&
                    ['.jpg', '.jpeg'].includes(child.ext.toLowerCase())) {

                    const outputPath = path.join(newFolderPath, `${child.name}.webp`);

                    await sharp(child.path)
                        .webp({
                            quality: quality,
                            effort: 6
                        })
                        .toFile(outputPath);

                    return { file: child.name, status: 'success' };
                }
            })
        );

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        return json({
            message: 'Batch conversion complete',
            outputFolder: newFolderPath,
            successful,
            failed,
            total: results.length
        });

    } catch (error) {
        console.error('Batch conversion error:', error);
        return json({ message: 'Failed to convert images' }, { status: 500 });
    }
};