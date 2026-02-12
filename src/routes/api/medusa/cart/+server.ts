import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** POST - Créer un panier */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const regionId = body.region_id;
		if (!regionId) {
			return json({ error: 'region_id is required' }, { status: 400 });
		}
		const { cart } = await medusa.store.cart.create({
			region_id: regionId
		});
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart create error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to create cart' },
			{ status: 500 }
		);
	}
};
