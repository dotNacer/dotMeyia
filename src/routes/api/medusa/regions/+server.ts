import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

export const GET: RequestHandler = async () => {
	try {
		const { regions } = await medusa.store.region.list({ fields: 'id,*countries' });
		return json({ regions });
	} catch (error) {
		console.error('Medusa regions error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch regions' },
			{ status: 500 }
		);
	}
};
