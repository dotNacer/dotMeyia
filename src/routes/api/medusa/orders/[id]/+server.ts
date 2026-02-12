import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

/** GET - Récupérer une commande */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const { order } = await medusa.store.order.retrieve(params.id, {
			fields: 'id,*items,status,total,display_id,created_at'
		});
		return json({ order });
	} catch (error) {
		console.error('Medusa order retrieve error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to retrieve order' },
			{ status: 500 }
		);
	}
};
