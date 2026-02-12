import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** GET - Fournisseurs de paiement disponibles pour une région */
export const GET: RequestHandler = async ({ url }) => {
	const regionId = url.searchParams.get('region_id');
	if (!regionId) {
		return json({ error: 'region_id is required' }, { status: 400 });
	}
	try {
		const { payment_providers } = await medusa.store.payment.listPaymentProviders({
			region_id: regionId
		});
		return json({ payment_providers });
	} catch (error) {
		console.error('Medusa payment providers error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch payment providers' },
			{ status: 500 }
		);
	}
};
