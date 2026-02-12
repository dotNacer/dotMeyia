<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import { cartStore } from '$lib/stores/cart';

	let products = $state<{ id: string; title: string; handle: string; thumbnail?: string; variants?: { id: string }[] }[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/medusa/products?limit=20');
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to load products');
			products = data.products ?? [];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Erreur chargement produits';
		} finally {
			loading = false;
		}
	});

	async function addToCart(variantId: string) {
		try {
			await cartStore.addItem(variantId);
		} catch (e) {
			alert(e instanceof Error ? e.message : 'Sélectionnez une région dans le panier');
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-2xl font-bold">Boutique</h1>
		<a href="/store/cart" class="text-sm text-primary hover:underline">Voir le panier</a>
	</div>

	{#if loading}
		<p class="text-muted-foreground">Chargement des produits...</p>
	{:else if error}
		<p class="text-destructive">{error}</p>
		<p class="text-sm text-muted-foreground mt-2">
			Assurez-vous que le backend Medusa est démarré (MEDUSA_BACKEND_URL).
		</p>
	{:else if products.length === 0}
		<p class="text-muted-foreground">Aucun produit disponible.</p>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each products as product}
				<Card.Root>
					<Card.Header>
						{#if product.thumbnail}
							<img
								src={product.thumbnail}
								alt={product.title}
								class="w-full h-40 object-cover rounded-md mb-2"
							/>
						{/if}
						<Card.Title>{product.title}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-muted-foreground">Variantes: {product.variants?.length ?? 0}</p>
					</Card.Content>
					<Card.Footer>
						{#if product.variants?.length}
							<Button.Root
								onclick={() => addToCart(product.variants![0].id)}
								size="sm"
							>
								Ajouter au panier
							</Button.Root>
						{:else}
							<Button.Root disabled size="sm">Pas de variante</Button.Root>
						{/if}
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
