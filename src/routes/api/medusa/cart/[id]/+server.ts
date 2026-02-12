import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** GET - Récupérer un panier */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const { cart } = await medusa.store.cart.retrieve(params.id, {
			fields: 'id,*items,*shipping_methods,*payment_collection,region_id'
		});
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart retrieve error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to retrieve cart' },
			{ status: 500 }
		);
	}
};

/** PATCH - Mettre à jour un panier (ex: region_id, email) */
export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const { cart } = await medusa.store.cart.update(params.id, body);
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart update error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to update cart' },
			{ status: 500 }
		);
	}
};
