import { supabase } from '$lib/supabase';
import { loading } from '$lib/stores';

export async function loadImages({
	tableName,
	imageTypeId
}: {
	tableName: string;
	imageTypeId: number;
}) {
	try {
		loading.set(true);

		const { data: data, error: error } = await supabase
			.from(tableName)
			.select(
				`
                *,
                tbl_image_types!inner (
                    image_type_name
                ),
                tbl_status_types!inner (
                    status_type_name
                )
            `
			)
			.eq('tbl_image_types.image_type_id', imageTypeId);

		if (error) throw error;

		if (!data) {
			return;
		}

		const images =
			data?.map((o) => ({
				file_name: o.file_name,
				text_data: o.text_data,
				created_at: o.created_at,
				updated_at: o.updated_at,
				image_url: o.image_url,
				text_raw: o.text_raw,
				user_id: o.user_id,
				image_id: o.image_id,
				image_type_name: o.tbl_image_types?.image_type_name || '',
				status_type_name: o.tbl_status_types?.status_type_name || ''
			})) || [];

		return { images, error: null };
	} catch (err) {
		console.error('Server error loading images:', err);
		return {
			images: [],
			error: err instanceof Error ? err.message : 'Failed to load images'
		};
	} finally {
		loading.set(false);
	}
}
