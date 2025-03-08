import { json } from '@sveltejs/kit';
import { loadImages } from '$lib/server/load-images';

export async function GET({ url }) {
	const tableName = url.searchParams.get('tableName');
	const imageTypeId = url.searchParams.get('imageTypeId');

	if (!tableName || !imageTypeId) {
		return json(
			{
				images: [],
				error: 'Missing required parameters'
			},
			{ status: 400 }
		);
	}

	const result = await loadImages({
		tableName,
		imageTypeId: parseInt(imageTypeId)
	});

	const images = result?.images || [];
	const error = result?.error || null;

	if (error) {
		return json({ images: [], error }, { status: 500 });
	}

	return json({ images, error: null });
}
