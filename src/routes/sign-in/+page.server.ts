import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	if (!fetch) {
		//throw redirect(303, "/");
	}

	if (!cookies) {
		//throw redirect(303, "/");
	}
};
