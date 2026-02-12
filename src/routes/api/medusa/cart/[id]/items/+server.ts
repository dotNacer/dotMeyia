import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** POST - Ajouter un article au panier */
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const { variant_id, quantity = 1 } = body;
		if (!variant_id) {
			return json({ error: 'variant_id is required' }, { status: 400 });
		}
		const { cart } = await medusa.store.cart.createLineItem(params.id, {
			variant_id,
			quantity
		});
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart add item error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to add item to cart' },
			{ status: 500 }
		);
	}
};
