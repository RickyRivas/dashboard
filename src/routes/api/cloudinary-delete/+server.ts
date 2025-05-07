import { v2 as cloudinary } from 'cloudinary';
import { json } from '@sveltejs/kit';

import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { PRIVATE_CLOUDINARY_API_KEY, PRIVATE_CLOUDINARY_API_SECRET } from '$env/static/private';

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PRIVATE_CLOUDINARY_API_KEY,
    api_secret: PRIVATE_CLOUDINARY_API_SECRET
});

export async function DELETE({ request }) {
    try {
        const { publicId } = await request.json();

        if (!publicId) {
            return json({ error: 'Public ID is required' }, { status: 400 });
        }

        // Delete the resource
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            return json({ success: true, message: 'Resource deleted successfully' });
        } else {
            return json({ success: false, message: 'Failed to delete resource', result }, { status: 500 });
        }
    } catch (error) {
        return json({ error: 'Failed to delete image' }, { status: 500 });
    }
}