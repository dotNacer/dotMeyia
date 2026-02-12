<script lang="ts">
	import { onMount } from 'svelte';
	import { cartStore } from '$lib/stores/cart';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Label from '$lib/components/ui/label';

	let regions = $state<{ id: string; name?: string; countries?: { id: string }[] }[]>([]);
	let selectedRegion = $state<string>('');
	let storeState = $state<{ cart: { id: string; region_id?: string; items?: { id: string; title?: string; quantity: number; unit_price?: number }[] } | null; loading: boolean }>({ cart: null, loading: false });

	$effect(() => {
		return cartStore.subscribe((s) => {
			storeState = s;
		});
	});

	const cart = $derived(storeState.cart);
	const loading = $derived(storeState.loading);

	onMount(async () => {
		const res = await fetch('/api/medusa/regions');
		const data = await res.json();
		regions = data.regions ?? [];
		const c = await cartStore.fetch();
		if (c?.region_id) selectedRegion = c.region_id;
	});

	async function createOrSelectRegion() {
		if (!selectedRegion) return;
		const existingId = cartStore.getCartId();
		if (existingId && cart?.region_id === selectedRegion) return;
		try {
			await cartStore.create(selectedRegion);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Erreur');
		}
	}

	function formatPrice(amount?: number, currency?: string) {
		if (amount == null) return '-';
		return new Intl.NumberFormat('fr-FR', {
			style: 'currency',
			currency: currency ?? 'eur'
		}).format(amount / 100);
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	<h1 class="text-2xl font-bold mb-6">Panier</h1>

	{#if !cart && regions.length > 0}
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Sélectionnez une région</Card.Title>
				<Card.Description>Pour créer un panier, choisissez votre région de livraison.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Label.Root for="region">Région</Label.Root>
				<Select.Root type="single" bind:value={selectedRegion}>
					<Select.Trigger id="region" class="w-full mt-2">
						{selectedRegion ? regions.find((r) => r.id === selectedRegion)?.name : 'Choisir...'}
					</Select.Trigger>
					<Select.Content>
						{#each regions as region}
							<Select.Item value={region.id} label={region.name ?? region.id} />
						{/each}
					</Select.Content>
				</Select.Root>
			</Card.Content>
			<Card.Footer>
				<Button.Root onclick={createOrSelectRegion} disabled={!selectedRegion || loading}>
					Créer le panier
				</Button.Root>
			</Card.Footer>
		</Card.Root>
	{:else if cart}
		{#if cart.items?.length}
			<div class="space-y-4 mb-6">
				{#each cart.items as item}
					<Card.Root class="flex flex-row items-center justify-between">
						<Card.Content class="flex-1 py-4">
							<p class="font-medium">{item.title ?? 'Article'}</p>
							<p class="text-sm text-muted-foreground">
								Qté: {item.quantity} × {formatPrice(item.unit_price)}
							</p>
						</Card.Content>
						<Card.Footer class="border-0">
							<Button.Root
								variant="destructive"
								size="sm"
								onclick={() => cartStore.removeItem(item.id)}
								disabled={loading}
							>
								Retirer
							</Button.Root>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
			<div class="flex justify-between items-center">
				<a href="/store/checkout">
					<Button.Root>Passer au paiement</Button.Root>
				</a>
			</div>
		{:else}
			<p class="text-muted-foreground">Votre panier est vide.</p>
			<a href="/store">
				<Button.Root variant="outline" class="mt-4">Voir les produits</Button.Root>
			</a>
		{/if}
	{:else}
		<p class="text-muted-foreground">Chargement...</p>
	{/if}
</div>
