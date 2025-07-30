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

	let chats: Chat[] = [];
	let loading = true;

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

<div class="container mx-auto p-6 max-w-4xl">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mes Chats</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-2">
				Discutez avec l'IA en utilisant vos contextes personnalisés
			</p>
		</div>
		<Button on:click={createNewChat} class="flex items-center gap-2">
			<Plus class="w-4 h-4" />
			Nouveau Chat
		</Button>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	{:else if chats.length === 0}
		<div class="text-center py-12">
			<MessageSquare class="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
				Aucun chat pour le moment
			</h3>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				Commencez votre première conversation avec l'IA
			</p>
			<Button on:click={createNewChat} class="flex items-center gap-2">
				<Plus class="w-4 h-4" />
				Créez votre premier chat
			</Button>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each chats as chat}
				<Card 
					class="cursor-pointer hover:shadow-md transition-shadow"
					on:click={() => openChat(chat.id)}
				>
					<CardHeader class="pb-3">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<CardTitle class="text-lg font-semibold text-gray-900 dark:text-white">
									{chat.title}
								</CardTitle>
								{#if chat.context}
									<div class="flex items-center gap-2 mt-1">
										<span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
											{chat.context.title}
										</span>
									</div>
								{/if}
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<Clock class="w-4 h-4" />
								{formatDate(chat.updatedAt)}
							</div>
						</div>
					</CardHeader>
					<CardContent class="pt-0">
						<p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
							{getLastMessage(chat)}
						</p>
						<div class="flex items-center justify-between mt-3">
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