import { v2 as cloudinary } from 'cloudinary';
import { json } from '@sveltejs/kit';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import { PRIVATE_CLOUDINARY_API_KEY, PRIVATE_CLOUDINARY_API_SECRET } from '$env/static/private';

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PRIVATE_CLOUDINARY_API_KEY,
    api_secret: PRIVATE_CLOUDINARY_API_SECRET
});

export async function POST({ request }) {
    const { folder } = await request.json()

    if (!folder) return json({ error: 'invalid credentials' }, { status: 400 });

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: folder,
            max_results: 500
        });

        const transformedResources = result.resources.map(resource => {
            const croppedUrl = cloudinary.url(resource.public_id, {
                width: 450,
                height: 450,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto'
            });

            return {
                ...resource,
                cropped_url: croppedUrl
            };
        })

        return json(transformedResources);
    } catch (error) {
        return json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}