import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** POST - Initialiser une session de paiement (créé payment_collection si besoin) */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { cart, provider_id, data } = body;
		if (!cart) {
			return json({ error: 'cart object is required' }, { status: 400 });
		}
		if (!provider_id) {
			return json({ error: 'provider_id is required' }, { status: 400 });
		}
		const { payment_collection } = await medusa.store.payment.initiatePaymentSession(
			cart,
			{
				provider_id,
				data: data ?? {}
			}
		);
		return json({ payment_collection });
	} catch (error) {
		console.error('Medusa payment initiate error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to initiate payment' },
			{ status: 500 }
		);
	}
};
