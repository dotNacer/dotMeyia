<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cartStore } from '$lib/stores/cart';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Label from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	let cart = $state<{ id: string; region_id?: string; items?: { id: string; title?: string; quantity: number; unit_price?: number }[] } | null>(null);
	let loading = $state(false);
	let shippingOptions = $state<{ id: string; name?: string; amount?: number }[]>([]);
	let paymentProviders = $state<{ id: string }[]>([]);
	let selectedShipping = $state<string>('');
	let selectedProvider = $state<string>('');
	let paymentInitiated = $state(false);
	let completing = $state(false);

	$effect(() => {
		const unsub = cartStore.subscribe((s) => {
			cart = s.cart;
			loading = s.loading;
		});
		return () => unsub();
	});

	onMount(async () => {
		const id = cartStore.getCartId();
		if (!id) {
			goto('/store/cart');
			return;
		}
		await cartStore.fetch();
		if (!cart?.items?.length) {
			goto('/store/cart');
			return;
		}
		// Charger options d'expédition
		try {
			const shipRes = await fetch(`/api/medusa/shipping-options?cart_id=${id}`);
			const shipData = await shipRes.json();
			shippingOptions = shipData.shipping_options ?? [];
			if (shippingOptions.length) selectedShipping = shippingOptions[0].id;
		} catch {
			/* ignoré */
		}
		// Charger fournisseurs de paiement
		if (cart?.region_id) {
			const payRes = await fetch(`/api/medusa/payment-providers?region_id=${cart.region_id}`);
			const payData = await payRes.json();
			paymentProviders = payData.payment_providers ?? [];
			if (paymentProviders.length) selectedProvider = paymentProviders[0].id;
		}
	});

	function formatPrice(amount?: number) {
		if (amount == null) return '-';
		return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'eur' }).format(amount / 100);
	}

	async function addShipping() {
		if (!selectedShipping || !cart) return;
		try {
			await cartStore.addShipping(selectedShipping);
			toast.success('Livraison ajoutée');
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Erreur');
		}
	}

	async function initPayment() {
		if (!selectedProvider || !cart) return;
		try {
			const collection = await cartStore.initiatePayment(selectedProvider, cart);
			// Si le provider retourne une URL (ex: Stripe Checkout), rediriger
			const sessions = (collection as { payment_sessions?: Array<{ data?: { url?: string } }> })?.payment_sessions;
			const session = sessions?.[0];
			const url = session?.data?.url;
			if (url) {
				window.location.href = url;
				return;
			}
			paymentInitiated = true;
			toast.success('Paiement initialisé');
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Erreur paiement');
		}
	}

	async function completeOrder() {
		if (!cart) return;
		completing = true;
		try {
			const result = await cartStore.complete();
			if (result.order) {
				goto(`/store/order/${result.order.id}`);
			} else {
				toast.error(result.error ?? 'Paiement incomplet. Configurez un provider (ex: Stripe) dans Medusa.');
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : 'Erreur');
		} finally {
			completing = false;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-2xl font-bold mb-6">Checkout</h1>

	{#if !cart?.items?.length}
		<p class="text-muted-foreground">Redirection vers le panier...</p>
	{:else}
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Récapitulatif</Card.Title>
			</Card.Header>
			<Card.Content>
				{#each cart.items ?? [] as item}
					<p>{item.title ?? 'Article'} × {item.quantity} - {formatPrice(item.unit_price)}</p>
				{/each}
			</Card.Content>
		</Card.Root>

		{#if shippingOptions.length > 0}
			<Card.Root class="mb-6">
				<Card.Header>
					<Card.Title>Livraison</Card.Title>
				</Card.Header>
				<Card.Content>
					<Label.Root>Option</Label.Root>
					<select
						bind:value={selectedShipping}
						class="w-full mt-2 h-10 rounded-md border px-3 py-2"
					>
						{#each shippingOptions as opt}
							<option value={opt.id}>{opt.name ?? opt.id} - {formatPrice(opt.amount)}</option>
						{/each}
					</select>
				</Card.Content>
				<Card.Footer>
					<Button.Root onclick={addShipping} disabled={loading}>Appliquer</Button.Root>
				</Card.Footer>
			</Card.Root>
		{/if}

		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Paiement</Card.Title>
				<Card.Description>
					{#if paymentProviders.length === 0}
						Aucun fournisseur configuré. Configurez Stripe/Manual dans le backend Medusa.
					{:else}
						Sélectionnez un mode de paiement.
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if paymentProviders.length > 0}
					<select
						bind:value={selectedProvider}
						class="w-full h-10 rounded-md border px-3 py-2"
					>
						{#each paymentProviders as p}
							<option value={p.id}>{p.id}</option>
						{/each}
					</select>
				{/if}
			</Card.Content>
			<Card.Footer class="flex gap-2">
				{#if !paymentInitiated && paymentProviders.length > 0}
					<Button.Root onclick={initPayment} disabled={loading}>
						Initialiser le paiement
					</Button.Root>
				{/if}
				<Button.Root
					onclick={completeOrder}
					disabled={completing}
				>
					{completing ? 'Traitement...' : 'Finaliser la commande'}
				</Button.Root>
			</Card.Footer>
		</Card.Root>
	{/if}
</div>
