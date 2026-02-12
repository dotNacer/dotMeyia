import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** GET - Options d'expédition pour un panier */
export const GET: RequestHandler = async ({ url }) => {
	const cartId = url.searchParams.get('cart_id');
	if (!cartId) {
		return json({ error: 'cart_id is required' }, { status: 400 });
	}
	try {
		const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
			cart_id: cartId
		});
		return json({ shipping_options });
	} catch (error) {
		console.error('Medusa shipping options error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch shipping options' },
			{ status: 500 }
		);
	}
};
