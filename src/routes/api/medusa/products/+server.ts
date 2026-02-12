import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { medusa } from '$lib/medusa';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') ?? '20');
		const offset = parseInt(url.searchParams.get('offset') ?? '0');
		const { products, count } = await medusa.store.product.list({
			limit,
			offset,
			fields: 'id,title,handle,thumbnail,*variants'
		});
		return json({ products, count });
	} catch (error) {
		console.error('Medusa products error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch products' },
			{ status: 500 }
		);
	}
};
