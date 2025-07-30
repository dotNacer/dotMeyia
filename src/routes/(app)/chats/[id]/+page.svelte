<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { marked } from 'marked';

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

	let chat: Chat | null = null;
	let messageInput = '';
	let loading = false;
	let sending = false;
	let messagesContainer: HTMLElement;

	$: chatId = $page.params.id;

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

	async function sendMessage() {
		if (!messageInput.trim() || sending) return;

		const messageContent = messageInput.trim();
		messageInput = '';
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
				toast.error(error.error || 'Erreur lors de l\'envoi du message');
				// Restaurer le message dans l'input
				messageInput = messageContent;
			}
		} catch (error) {
			console.error('Error sending message:', error);
			toast.error('Erreur lors de l\'envoi du message');
			messageInput = messageContent;
		} finally {
			sending = false;
		}
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	function formatMessage(content: string) {
		return marked(content);
	}

	function formatTime(dateString: string) {
		return new Date(dateString).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function goBack() {
		goto('/chats');
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<svelte:head>
	<title>{chat?.title || 'Chat'} - DotMeYIA</title>
</svelte:head>

<div class="flex flex-col h-screen">
	<!-- Header -->
	<div class="border-b bg-white dark:bg-gray-900">
		<div class="flex items-center gap-4 p-4">
			<Button variant="ghost" size="sm" on:click={goBack} class="flex items-center gap-2">
				<ArrowLeft class="w-4 h-4" />
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
			<div class="flex items-center justify-center h-full">
				<Loader2 class="w-8 h-8 animate-spin text-blue-600" />
			</div>
		{:else if chat}
			<div 
				bind:this={messagesContainer}
				class="h-full overflow-y-auto p-4 space-y-4"
			>
				{#if chat.messages.length === 0}
					<div class="text-center py-12">
						<Bot class="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
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
						<div class="flex gap-3 {message.role === 'USER' ? 'justify-end' : 'justify-start'}">
							{#if message.role === 'ASSISTANT'}
								<div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
									<Bot class="w-4 h-4 text-white" />
								</div>
							{/if}
							
							<Card class="max-w-[80%] {message.role === 'USER' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}">
								<CardContent class="p-3">
									{#if message.role === 'ASSISTANT'}
										<div class="prose prose-sm dark:prose-invert max-w-none" set:html={formatMessage(message.content)} />
									{:else}
										<p class="text-sm whitespace-pre-wrap">{message.content}</p>
									{/if}
									<p class="text-xs opacity-70 mt-2">
										{formatTime(message.createdAt)}
									</p>
								</CardContent>
							</Card>

							{#if message.role === 'USER'}
								<div class="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
									<User class="w-4 h-4 text-white" />
								</div>
							{/if}
						</div>
					{/each}
				{/if}

				{#if sending}
					<div class="flex gap-3 justify-start">
						<div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
							<Bot class="w-4 h-4 text-white" />
						</div>
						<Card class="bg-gray-100 dark:bg-gray-800">
							<CardContent class="p-3">
								<div class="flex items-center gap-2">
									<Loader2 class="w-4 h-4 animate-spin" />
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
	<div class="border-t bg-white dark:bg-gray-900 p-4">
		<div class="flex gap-3">
			<Input
				bind:value={messageInput}
				placeholder="Tapez votre message..."
				on:keypress={handleKeyPress}
				disabled={sending}
				class="flex-1"
			/>
			<Button 
				on:click={sendMessage} 
				disabled={!messageInput.trim() || sending}
				size="icon"
			>
				{#if sending}
					<Loader2 class="w-4 h-4 animate-spin" />
				{:else}
					<Send class="w-4 h-4" />
				{/if}
			</Button>
		</div>
	</div>
</div>