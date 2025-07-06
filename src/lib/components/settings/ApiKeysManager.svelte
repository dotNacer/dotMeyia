<script lang="ts">
	import { apiKeys } from '$lib/stores/apiKeys';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { fly } from 'svelte/transition';
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	// Variables pour la gestion des clés API
	let showCreateApiKeyForm = $state(false);
	let newApiKeyName = $state('');
	let newApiKeyExpiry = $state('');
	let createdApiKey: any = $state(null);

	onMount(() => {
		apiKeys.fetch();
	});

	async function createApiKey() {
		if (!newApiKeyName.trim()) {
			toast.error('Le nom de la clé API est requis');
			return;
		}

		const apiKeyData = {
			name: newApiKeyName.trim(),
			expiresAt: newApiKeyExpiry ? new Date(newApiKeyExpiry) : null
		};

		const result = await apiKeys.create(apiKeyData);
		if (result) {
			createdApiKey = result;
			newApiKeyName = '';
			newApiKeyExpiry = '';
			showCreateApiKeyForm = false;
			toast.success('Clé API créée avec succès');
		} else {
			toast.error('Erreur lors de la création de la clé API');
		}
	}

	let deletingApiKey: string | null = $state(null);

	async function deleteApiKey() {
		if (!deletingApiKey) return;
		await apiKeys.delete(deletingApiKey);
		deletingApiKey = null; // Reset après suppression
	}

	function cancelDelete() {
		deletingApiKey = null;
	}

	async function toggleApiKey(id: string, isActive: boolean) {
		await apiKeys.toggleActive(id, !isActive);
	}

	// TODO: Mettre ça dans un utils
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast.success('Copié dans le presse-papiers');
	}

	function formatDate(date: string | Date | null) {
		if (!date) return 'Jamais';
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleDateString('fr-FR');
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Clés API</h1>
		<Button onclick={() => (showCreateApiKeyForm = true)}>Nouvelle clé API</Button>
	</div>

	{#if createdApiKey}
		<div class="rounded-md border border-green-200 bg-green-50 p-4">
			<h3 class="font-semibold text-green-800">Clé API créée avec succès !</h3>
			<p class="mt-1 text-sm text-green-700">
				Cliquez pour copier votre clé API. Elle ne sera plus affichée après fermeture.
			</p>
			<div class="mt-2 flex items-center gap-2">
				<Button class="flex-1" onclick={() => copyToClipboard(createdApiKey.token)}>
					Copier la clé API
				</Button>
			</div>
			<button
				class="mt-2 text-sm text-green-600 hover:text-green-800"
				onclick={() => (createdApiKey = null)}
			>
				Fermer
			</button>
		</div>
	{/if}

	<!-- Formulaire de création -->
	{#if showCreateApiKeyForm}
		<div class="rounded-md border bg-gray-50 p-4" in:fly={{ y: -10 }}>
			<h3 class="mb-4 font-semibold">Créer une nouvelle clé API</h3>
			<div class="space-y-4">
				<div>
					<Label class="mb-1 block text-sm font-medium">Nom de la clé</Label>
					<Input
						type="text"
						bind:value={newApiKeyName}
						placeholder="Ex: Serveur MCP Production"
						class="w-full rounded-md border p-2"
					/>
				</div>
				<div>
					<Label class="mb-1 block text-sm font-medium">Date d'expiration (optionnel)</Label>
					<Input type="date" bind:value={newApiKeyExpiry} class="w-full rounded-md border p-2" />
				</div>
				<div class="flex gap-2">
					<Button onclick={createApiKey}>Créer</Button>
					<Button variant="outline" onclick={() => (showCreateApiKeyForm = false)}>Annuler</Button>
				</div>
			</div>
		</div>
	{:else}
		<!-- Liste des clés API existantes -->
		<div class="space-y-4" in:fly={{ y: -10 }}>
			{#each $apiKeys as apiKey}
				<div class="rounded-md border p-4 {apiKey.isActive ? 'bg-white' : 'bg-gray-50'}">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<h3 class="font-semibold {apiKey.isActive ? 'text-gray-900' : 'text-gray-500'}">
								{apiKey.name}
							</h3>
							<div class="mt-1 text-sm text-gray-600">
								<span class="font-mono">{apiKey.token}</span>
								{#if apiKey.token.includes('...')}
									<span class="ml-2 text-xs text-gray-500">(Token masqué pour la sécurité)</span>
								{:else}
									<Button size="sm" variant="ghost" onclick={() => copyToClipboard(apiKey.token)}
										>Copier</Button
									>
								{/if}
							</div>
							<div class="mt-2 text-xs text-gray-500">
								Créée le {formatDate(apiKey.createdAt)} • Dernière utilisation: {formatDate(
									apiKey.lastUsedAt
								)} •
								{#if apiKey.expiresAt}
									Expire le {formatDate(apiKey.expiresAt)}
								{:else}
									Sans expiration
								{/if}
							</div>
						</div>
						<div class="flex items-center gap-2">
							<Button
								class=" text-sm {apiKey.isActive
									? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
									: 'bg-green-100 text-green-800 hover:bg-green-200'}"
								onclick={() => toggleApiKey(apiKey.id, apiKey.isActive)}
							>
								{apiKey.isActive ? 'Désactiver' : 'Activer'}
							</Button>

							<div class="flex items-center gap-1">
								{#if deletingApiKey !== apiKey.id}
									<div in:scale={{ duration: 200, easing: quintOut }}>
										<Button
											variant="destructive"
											size="sm"
											onclick={() => (deletingApiKey = apiKey.id)}
										>
											Supprimer
										</Button>
									</div>
								{:else}
									<div
										class="flex items-center gap-1"
										in:scale={{ duration: 200, easing: quintOut }}
									>
										<Button variant="destructive" size="sm" onclick={() => deleteApiKey()}>
											Confirmer
										</Button>
										<Button variant="outline" size="sm" onclick={cancelDelete}>Annuler</Button>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-muted-foreground">
					<p>Aucune clé API créée.</p>
					<p class="text-sm">Créez votre première clé pour commencer à utiliser l'API.</p>
				</div>
			{/each}
		</div>

		<!-- Documentation -->
		<!-- <div class="rounded-md border border-blue-200 bg-blue-50 p-4">
		<h3 class="mb-2 font-semibold text-blue-800">Comment utiliser vos clés API</h3>
		<div class="space-y-2 text-sm text-blue-700">
			<p>Incluez votre clé API dans l'en-tête Authorization de vos requêtes :</p>
			<code class="block rounded border bg-white p-2 font-mono text-xs">
				Authorization: Bearer votre_cle_api
			</code>
			<p>Exemple avec curl :</p>
			<code class="block rounded border bg-white p-2 font-mono text-xs">
				curl -H "Authorization: Bearer votre_cle_api" https://votre-domaine.com/api/notes
			</code>
			<p class="mt-3 text-xs">
				<strong>⚠️ Important :</strong> Pour des raisons de sécurité, les tokens des clés existantes
				sont masqués. Assurez-vous de copier votre clé API complète immédiatement après sa création.
			</p>
		</div>
	</div> -->
	{/if}
</div>
