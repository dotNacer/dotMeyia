<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { ArrowLeft, Bot, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import ChatMessage from '$lib/components/chat/chat-message.svelte';
	import ChatInput from '$lib/components/chat/chat-input.svelte';

	interface Message {
		id: string;
		content: string;
		role: 'USER' | 'ASSISTANT';
		createdAt: string;
	}

	interface Chat {
		id: string;
		title: string;
		context?: {
			id: string;
			title: string;
			prompt: string;
		};
		messages: Message[];
	}

	let chat = $state<Chat | null>(null);
	let loading = $state(false);
	let sending = $state(false);
	let messagesContainer = $state<HTMLElement>();

	let chatId = $derived($page.params.id);

	onMount(async () => {
		await loadChat();
	});

	async function loadChat() {
		loading = true;
		try {
			const response = await fetch(`/api/chats/${chatId}`);
			if (response.ok) {
				chat = await response.json();
				await tick();
				scrollToBottom();
			} else {
				toast.error('Chat non trouvé');
				goto('/chats');
			}
		} catch (error) {
			console.error('Error loading chat:', error);
			toast.error('Erreur lors du chargement du chat');
		} finally {
			loading = false;
		}
	}

	async function sendMessage(messageContent: string) {
		if (!messageContent.trim() || sending) return;

		sending = true;

		try {
			const response = await fetch(`/api/chats/${chatId}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: messageContent
				})
			});

			if (response.ok) {
				const result = await response.json();
				// Ajouter les nouveaux messages au chat
				if (chat) {
					chat.messages.push(result.userMessage, result.assistantMessage);
					await tick();
					scrollToBottom();
				}
			} else {
				const error = await response.json();
				toast.error(error.error || "Erreur lors de l'envoi du message");
			}
		} catch (error) {
			console.error('Error sending message:', error);
			toast.error("Erreur lors de l'envoi du message");
		} finally {
			sending = false;
		}
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}



	function goBack() {
		goto('/chats');
	}


</script>

<svelte:head>
	<title>{chat?.title || 'Chat'} - DotMeYIA</title>
</svelte:head>

<div class="flex h-screen flex-col">
	<!-- Header -->
	<div class="border-b bg-white dark:bg-gray-900">
		<div class="flex items-center gap-4 p-4">
			<Button variant="ghost" size="sm" on:click={goBack} class="flex items-center gap-2">
				<ArrowLeft class="h-4 w-4" />
				Retour
			</Button>
			<div class="flex-1">
				<h1 class="text-lg font-semibold text-gray-900 dark:text-white">
					{chat?.title || 'Chargement...'}
				</h1>
				{#if chat?.context}
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Contexte: {chat.context.title}
					</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Messages -->
	<div class="flex-1 overflow-hidden">
		{#if loading}
			<div class="flex h-full items-center justify-center">
				<Loader2 class="h-8 w-8 animate-spin text-blue-600" />
			</div>
		{:else if chat}
			<div bind:this={messagesContainer} class="h-full space-y-4 overflow-y-auto p-4">
				{#if chat.messages.length === 0}
					<div class="py-12 text-center">
						<Bot class="mx-auto mb-4 h-16 w-16 text-gray-400" />
						<h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">
							Commencez la conversation
						</h3>
						<p class="text-gray-600 dark:text-gray-400">
							{#if chat.context}
								L'IA utilisera le contexte "{chat.context.title}" pour répondre à vos questions.
							{:else}
								Envoyez votre premier message à l'IA.
							{/if}
						</p>
					</div>
				{:else}
					{#each chat.messages as message}
						<ChatMessage {message} />
					{/each}
				{/if}

				{#if sending}
					<div class="flex justify-start gap-3">
						<div
							class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600"
						>
							<Bot class="h-4 w-4 text-white" />
						</div>
						<Card class="bg-gray-100 dark:bg-gray-800">
							<CardContent class="p-3">
								<div class="flex items-center gap-2">
									<Loader2 class="h-4 w-4 animate-spin" />
									<span class="text-sm">L'IA réfléchit...</span>
								</div>
							</CardContent>
						</Card>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Input -->
	<div class="border-t bg-white p-4 dark:bg-gray-900">
		<ChatInput 
			onSend={sendMessage}
			loading={sending}
			disabled={loading}
		/>
	</div>
</div>
