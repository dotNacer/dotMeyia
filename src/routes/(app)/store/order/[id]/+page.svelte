<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';

	let order = $state<{ id: string; display_id?: number; status?: string; items?: { title?: string; quantity: number; unit_price?: number }[]; total?: number } | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(() => {
		const id = $page.params.id;
		if (!id) {
			loading = false;
			return;
		}
		fetch(`/api/medusa/orders/${id}`)
			.then((r) => r.json())
			.then((data) => {
				order = data.order ?? null;
				error = data.error ?? null;
			})
			.catch(() => (error = 'Erreur chargement'))
			.finally(() => (loading = false));
	});

	function formatPrice(amount?: number) {
		if (amount == null) return '-';
		return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'eur' }).format(amount / 100);
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
	{#if loading}
		<p class="text-muted-foreground">Chargement de la commande...</p>
	{:else if error}
		<p class="text-destructive">{error}</p>
	{:else if order}
		<h1 class="text-2xl font-bold mb-6">Commande #{order.display_id ?? order.id}</h1>
		<Card.Root>
			<Card.Header>
				<Card.Title>Statut: {order.status ?? '-'}</Card.Title>
			</Card.Header>
			<Card.Content>
				{#each order.items ?? [] as item}
					<p>{item.title ?? 'Article'} × {item.quantity} - {formatPrice(item.unit_price)}</p>
				{/each}
				<p class="font-semibold mt-4">Total: {formatPrice(order.total)}</p>
			</Card.Content>
			<Card.Footer>
				<a href="/store">
					<Button.Root variant="outline">Retour à la boutique</Button.Root>
				</a>
			</Card.Footer>
		</Card.Root>
	{:else}
		<p class="text-muted-foreground">Commande introuvable.</p>
	{/if}
</div>
