/**
 * Medusa JS SDK v2 - Client configuration (server-side only)
 * Utilisé pour les appels API proxy depuis SvelteKit
 */
import Medusa from '@medusajs/js-sdk';

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000';

export const medusa = new Medusa({
	baseUrl: MEDUSA_BACKEND_URL,
	debug: process.env.NODE_ENV === 'development',
});

export { medusa as default };
