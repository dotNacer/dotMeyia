<script lang="ts">
	import { contexts } from '$lib/stores/contexts';
	import { onMount } from 'svelte';
	import { Input } from '$lib/components/ui/input';

	// Selectionne le contexte préféré si selectionné
	let selectedContextId: string | null = $state(contexts.selected.get());
	let chatStarted = $state(false);
	let userInput = $state('');

	import { Button } from '$lib/components/ui/button';
	import { Chat } from '@ai-sdk/svelte';
	import { Send } from 'lucide-svelte';
	import ChatMessage from '$lib/components/ai/ChatMessage.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	let chat: Chat | null = $state(null);
	let messagesContainer: HTMLDivElement;

	function startChat() {
		if (!selectedContextId) return;

		chat = new Chat({
			api: '/api/ai/context',
			body: {
				contextId: selectedContextId
			}
		});

		chatStarted = true;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!chatStarted && selectedContextId) {
			startChat();

			if (!chat) return;
			chat.input = userInput;
			chat.handleSubmit(e);
			userInput = '';
		} else if (chatStarted && chat) {
			chat.handleSubmit(e);
		}
	}

	function handleInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		if (chatStarted && chat) {
			chat.input = value;
		} else {
			userInput = value;
		}
	}

	$effect(() => {
		if (messagesContainer && chat?.messages?.length) {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});

	onMount(async () => {
		contexts.fetch();
	});
</script>

<ScrollArea class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		{#each $contexts as context}
			<Button
				variant={selectedContextId === context.id ? 'default' : 'outline'}
				onclick={() => (!chatStarted ? (selectedContextId = context.id) : null)}
				disabled={chatStarted}
			>
				{context.title}
			</Button>
		{/each}
	</div>

	<div
		bind:this={messagesContainer}
		class="mb-4 flex-1 space-y-4 overflow-y-auto rounded-md bg-card p-4"
	>
		{#if chatStarted && chat?.messages}
			{#each chat.messages as message}
				<ChatMessage {message} />
			{/each}
		{:else}
			<div class="flex h-full items-center justify-center">
				<p class="text-sm text-muted-foreground">Commencez une conversation...</p>
			</div>
		{/if}
	</div>

	<form onsubmit={handleSubmit} class="flex items-center gap-2 p-4">
		<Input
			value={chatStarted && chat ? chat.input : userInput}
			oninput={handleInputChange}
			placeholder="Saisissez votre message..."
			class="flex-1"
		/>
		<Button type="submit" size="icon" disabled={!selectedContextId}>
			<Send class="h-4 w-4" />
		</Button>
	</form>
</ScrollArea>
