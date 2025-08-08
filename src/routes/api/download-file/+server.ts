import { json } from '@sveltejs/kit'
import fs from 'fs/promises';
import path from 'path';

export async function GET({ url }) {
    try {
        const filePath = url.searchParams.get('filepath')

        if (!filePath) {
            return new Response('File path required', { status: 400 });
        }

        const decodedPath = decodeURIComponent(filePath);

        try {
            const stats = await fs.stat(decodedPath);
            console.log('5. File exists! Stats:', {
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                size: stats.size
            });

            if (!stats.isFile()) {
                console.log('6. ERROR: Path exists but is not a file');
                return new Response('Not a file', { status: 400 });
            }
        } catch (statError) {
            console.log('6. ERROR: fs.stat failed:', statError.message);
            console.log('   Error code:', statError.code);

            // Try to check if directory exists
            const dirPath = path.dirname(decodedPath);
            try {
                await fs.stat(dirPath);
                console.log('   Parent directory exists:', dirPath);
            } catch (dirError) {
                console.log('   Parent directory does not exist:', dirPath);
            }

            throw statError;
        }

        // Check if file exists and is actually a file
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            return new Response('Not a file', { status: 400 });
        }

        // Read the file
        const fileBuffer = await fs.readFile(filePath);
        const fileName = path.basename(filePath);

        // Determine content type based on file extension
        const ext = path.extname(fileName).toLowerCase();
        const contentType = getContentType(ext);

        // Return file with appropriate headers
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Length': stats.size.toString(),
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error('Download error:', error);

        if (error.code === 'ENOENT') {
            return new Response('File not found', { status: 404 });
        } else if (error.code === 'EACCES') {
            return new Response('Access denied', { status: 403 });
        }

        return new Response('Download failed', { status: 500 });
    }
}

// Helper function to determine content type
function getContentType(extension) {
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.zip': 'application/zip',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.json': 'application/json'
    };

    return mimeTypes[extension] || 'application/octet-stream';
}