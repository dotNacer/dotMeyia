import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** PATCH - Mettre à jour la quantité d'un article */
export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const { quantity } = body;
		const { cart } = await medusa.store.cart.updateLineItem(
			params.id,
			params.lineId,
			{ quantity: quantity ?? 1 }
		);
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart update item error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to update item' },
			{ status: 500 }
		);
	}
};

/** DELETE - Supprimer un article du panier */
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const result = await medusa.store.cart.deleteLineItem(params.id, params.lineId);
		return json(result);
	} catch (error) {
		console.error('Medusa cart delete item error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to remove item' },
			{ status: 500 }
		);
	}
};
