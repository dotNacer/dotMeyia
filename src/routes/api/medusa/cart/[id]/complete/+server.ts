import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** POST - Finaliser le panier et créer la commande */
export const POST: RequestHandler = async ({ params }) => {
	try {
		const result = await medusa.store.cart.complete(params.id);
		// result peut être { type: 'cart', cart, error } ou { type: 'order', order }
		return json(result);
	} catch (error) {
		console.error('Medusa cart complete error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to complete order' },
			{ status: 500 }
		);
	}
};
