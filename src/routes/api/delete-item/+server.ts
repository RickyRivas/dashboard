// src/routes/api/delete/+server.js
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE({ request }) {
    try {
        const { systemPath } = await request.json();

        if (!systemPath) {
            return json({
                success: false,
                message: "System path is required"
            }, { status: 400 });
        }

        // security check to prevent deletion outside allowed directories
        const allowedBasePath = '/Applications/MAMP/www/';
        if (!systemPath.startsWith(allowedBasePath)) {
            return json({
                success: false,
                message: "Access denied: Path outside allowed directory"
            }, { status: 403 });
        }

        // Check if path exists
        try {
            await fs.access(systemPath);
        } catch {
            return json({
                success: false,
                message: "File or directory not found"
            }, { status: 404 });
        }

        // Delete the file or directory
        await fs.rm(systemPath, { recursive: true, force: true });

        return json({
            success: true,
            message: `Successfully deleted: ${path.basename(systemPath)}`
        });

    } catch (error) {
        return json({
            success: false,
            message: "Failed to delete file or directory"
        }, { status: 500 });
    }
}