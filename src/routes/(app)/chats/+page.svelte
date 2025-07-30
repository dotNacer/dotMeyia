<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Plus, MessageSquare, Clock, Settings } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Chat {
		id: string;
		title: string;
		createdAt: string;
		updatedAt: string;
		context?: {
			id: string;
			title: string;
		};
		messages: Array<{
			id: string;
			content: string;
			role: string;
			createdAt: string;
		}>;
		_count: {
			messages: number;
		};
	}

	let chats = $state<Chat[]>([]);
	let loading = $state(true);

	onMount(async () => {
		await loadChats();
	});

	async function loadChats() {
		try {
			const response = await fetch('/api/chats');
			if (response.ok) {
				chats = await response.json();
			} else {
				toast.error('Erreur lors du chargement des chats');
			}
		} catch (error) {
			console.error('Error loading chats:', error);
			toast.error('Erreur lors du chargement des chats');
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
		} else if (diffInHours < 168) {
			return date.toLocaleDateString('fr-FR', { weekday: 'short' });
		} else {
			return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
		}
	}

	function getLastMessage(chat: Chat) {
		return chat.messages[0]?.content || 'Aucun message';
	}

	function openChat(chatId: string) {
		goto(`/chats/${chatId}`);
	}

	function createNewChat() {
		goto('/chats/new');
	}
</script>

<svelte:head>
	<title>Chats - DotMeYIA</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-6">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mes Chats</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				Discutez avec l'IA en utilisant vos contextes personnalisés
			</p>
		</div>
		<Button onclick={createNewChat} class="flex items-center gap-2">
			<Plus class="h-4 w-4" />
			Nouveau Chat
		</Button>
	</div>

	{#if loading}
		<div class="flex h-64 items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
		</div>
	{:else if chats.length === 0}
		<div class="py-12 text-center">
			<MessageSquare class="mx-auto mb-4 h-16 w-16 text-gray-400" />
			<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
				Aucun chat pour le moment
			</h3>
			<p class="mb-6 text-gray-600 dark:text-gray-400">
				Commencez votre première conversation avec l'IA
			</p>
			<Button onclick={createNewChat} class="flex items-center gap-2">
				<Plus class="h-4 w-4" />
				Créez votre premier chat
			</Button>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each chats as chat}
				<Card
					class="cursor-pointer transition-shadow hover:shadow-md"
					onclick={() => openChat(chat.id)}
				>
					<CardHeader class="pb-3">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<CardTitle class="text-lg font-semibold text-gray-900 dark:text-white">
									{chat.title}
								</CardTitle>
								{#if chat.context}
									<div class="mt-1 flex items-center gap-2">
										<span
											class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
										>
											{chat.context.title}
										</span>
									</div>
								{/if}
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<Clock class="h-4 w-4" />
								{formatDate(chat.updatedAt)}
							</div>
						</div>
					</CardHeader>
					<CardContent class="pt-0">
						<p class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
							{getLastMessage(chat)}
						</p>
						<div class="mt-3 flex items-center justify-between">
							<span class="text-xs text-gray-500">
								{chat._count.messages} message{chat._count.messages > 1 ? 's' : ''}
							</span>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}
</div>
