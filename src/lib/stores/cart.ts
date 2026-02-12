import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const CART_ID_KEY = 'medusa_cart_id';

type CartItem = {
	id: string;
	variant_id?: string;
	quantity: number;
	title?: string;
	thumbnail?: string;
	unit_price?: number;
};

export type Cart = {
	id: string;
	region_id?: string;
	items?: CartItem[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

function createCartStore() {
	const { subscribe, set, update } = writable<{ cart: Cart | null; loading: boolean }>({
		cart: null,
		loading: false
	});

	const getCartId = (): string | null => {
		if (!browser) return null;
		return localStorage.getItem(CART_ID_KEY);
	};

	const setCartId = (id: string | null) => {
		if (!browser) return;
		if (id) localStorage.setItem(CART_ID_KEY, id);
		else localStorage.removeItem(CART_ID_KEY);
	};

	return {
		subscribe,
		async fetch(): Promise<Cart | null> {
			const id = getCartId();
			if (!id) {
				set({ cart: null, loading: false });
				return null;
			}
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}`);
				const data = await res.json();
				if (!res.ok) {
					setCartId(null);
					set({ cart: null, loading: false });
					return null;
				}
				set({ cart: data.cart, loading: false });
				return data.cart;
			} catch {
				set({ cart: null, loading: false });
				return null;
			}
		},
		async create(regionId: string): Promise<Cart | null> {
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch('/api/medusa/cart', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ region_id: regionId })
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to create cart');
				setCartId(data.cart.id);
				set({ cart: data.cart, loading: false });
				return data.cart;
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		async addItem(variantId: string, quantity = 1): Promise<Cart | null> {
			const id = getCartId();
			if (!id) throw new Error('No cart - select region first');
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}/items`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ variant_id: variantId, quantity })
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to add item');
				set({ cart: data.cart, loading: false });
				return data.cart;
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		async updateItem(lineId: string, quantity: number): Promise<Cart | null> {
			const id = getCartId();
			if (!id) throw new Error('No cart');
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}/items/${lineId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ quantity })
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to update');
				set({ cart: data.cart, loading: false });
				return data.cart;
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		async removeItem(lineId: string): Promise<void> {
			const id = getCartId();
			if (!id) return;
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}/items/${lineId}`, {
					method: 'DELETE'
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to remove');
				const cart = data.parent ?? null;
				set({ cart, loading: false });
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		async addShipping(optionId: string): Promise<Cart | null> {
			const id = getCartId();
			if (!id) throw new Error('No cart');
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}/shipping`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ option_id: optionId })
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to add shipping');
				set({ cart: data.cart, loading: false });
				return data.cart;
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		async initiatePayment(providerId: string, cart: Cart): Promise<unknown> {
			const res = await fetch('/api/medusa/payment/initiate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ cart, provider_id: providerId, data: {} })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to initiate payment');
			return data.payment_collection;
		},
		async complete(): Promise<{ order?: { id: string }; error?: string }> {
			const id = getCartId();
			if (!id) throw new Error('No cart');
			update((s) => ({ ...s, loading: true }));
			try {
				const res = await fetch(`/api/medusa/cart/${id}/complete`, {
					method: 'POST'
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || 'Failed to complete');
				if (data.type === 'order' && data.order) {
					setCartId(null);
					set({ cart: null, loading: false });
					return { order: data.order };
				}
				set({ cart: data.cart ?? null, loading: false });
				return { error: data.error || 'Payment incomplete' };
			} catch (err) {
				update((s) => ({ ...s, loading: false }));
				throw err;
			}
		},
		clearCart() {
			setCartId(null);
			set({ cart: null, loading: false });
		},
		getCartId,
		setCartId
	};
}

export const cartStore = createCartStore();
