import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** POST - Ajouter une méthode d'expédition au panier */
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const { option_id, data } = body;
		if (!option_id) {
			return json({ error: 'option_id is required' }, { status: 400 });
		}
		const { cart } = await medusa.store.cart.addShippingMethod(params.id, {
			option_id,
			data: data ?? {}
		});
		return json({ cart });
	} catch (error) {
		console.error('Medusa cart add shipping error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to add shipping method' },
			{ status: 500 }
		);
	}
};
