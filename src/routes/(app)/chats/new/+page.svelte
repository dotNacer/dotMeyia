<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
	import { ArrowLeft, Sparkles } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Context {
		id: string;
		title: string;
		prompt: string;
	}

	let title = '';
	let selectedContextId = '';
	let contexts: Context[] = [];
	let loading = false;
	let contextsLoading = true;

	onMount(async () => {
		await loadContexts();
	});

	async function loadContexts() {
		try {
			const response = await fetch('/api/contexts');
			if (response.ok) {
				contexts = await response.json();
			}
		} catch (error) {
			console.error('Error loading contexts:', error);
		} finally {
			contextsLoading = false;
		}
	}

	async function createChat() {
		if (!title.trim()) {
			toast.error('Veuillez entrer un titre pour le chat');
			return;
		}

		loading = true;
		try {
			const response = await fetch('/api/chats', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title.trim(),
					contextId: selectedContextId || null
				})
			});

			if (response.ok) {
				const chat = await response.json();
				toast.success('Chat créé avec succès');
				goto(`/chats/${chat.id}`);
			} else {
				const error = await response.json();
				toast.error(error.error || 'Erreur lors de la création du chat');
			}
		} catch (error) {
			console.error('Error creating chat:', error);
			toast.error('Erreur lors de la création du chat');
		} finally {
			loading = false;
		}
	}

	function goBack() {
		goto('/chats');
	}
</script>

<svelte:head>
	<title>Nouveau Chat - DotMeYIA</title>
</svelte:head>

<div class="container mx-auto p-6 max-w-2xl">
	<div class="flex items-center gap-4 mb-8">
		<Button variant="ghost" size="sm" on:click={goBack} class="flex items-center gap-2">
			<ArrowLeft class="w-4 h-4" />
			Retour
		</Button>
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Nouveau Chat</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-2">
				Créez une nouvelle conversation avec l'IA
			</p>
		</div>
	</div>

	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Sparkles class="w-5 h-5" />
				Configuration du chat
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<div class="space-y-2">
				<Label for="title">Titre du chat</Label>
				<Input
					id="title"
					bind:value={title}
					placeholder="Ex: Discussion sur l'intelligence artificielle"
					maxlength={100}
				/>
			</div>

			<div class="space-y-2">
				<Label for="context">Contexte (optionnel)</Label>
				<Select bind:value={selectedContextId}>
					<SelectTrigger>
						<SelectValue placeholder="Sélectionnez un contexte existant" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Aucun contexte</SelectItem>
						{#if contextsLoading}
							<SelectItem value="" disabled>Chargement...</SelectItem>
						{:else}
							{#each contexts as context}
								<SelectItem value={context.id}>
									{context.title}
								</SelectItem>
							{/each}
						{/if}
					</SelectContent>
				</Select>
				{#if selectedContextId}
					{@const selectedContext = contexts.find(c => c.id === selectedContextId)}
					{#if selectedContext}
						<div class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<p class="text-sm text-blue-800 dark:text-blue-200">
								<strong>Contexte sélectionné :</strong> {selectedContext.title}
							</p>
							<p class="text-xs text-blue-600 dark:text-blue-300 mt-1 line-clamp-2">
								{selectedContext.prompt}
							</p>
						</div>
					{/if}
				{/if}
			</div>

			<div class="flex gap-3 pt-4">
				<Button variant="outline" on:click={goBack}>
					Annuler
				</Button>
				<Button on:click={createChat} disabled={loading || !title.trim()}>
					{loading ? 'Création...' : 'Créer le chat'}
				</Button>
			</div>
		</CardContent>
	</Card>
</div>