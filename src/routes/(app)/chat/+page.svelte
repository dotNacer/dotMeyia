<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { ScrollArea } from '$lib/components/ui/scroll-area'
	import { Plus, Trash } from 'lucide-svelte'
	import { chats, type ChatWithContext } from '$lib/stores/chats'
	import { onMount } from 'svelte'
	import { cn } from '$lib/utils'
	import * as Tabs from '$lib/components/ui/tabs'
	onMount(async () => {
		await chats.fetch()
	})

	function handleCreateChat() {
		chats.create({
			title: 'New Chat',
			contextId: null,
			isActive: true,
		})
	}

	function handleEditChat(chat_id: string) {
		chats.edit(chat_id, {
			title: 'Edited chat',
			contextId: null,
			isActive: true,
		})
	}

	async function printChatInformation(chat_id: string) {
		const chat = await chats.get(chat_id)
		currentChat = chat
		console.log(chat)
	}

	let currentChat: ChatWithContext | null = $state(null)
	let selectedTab: 'active' | 'notActive' | 'all' = $state('active')
	let showedChats: ChatWithContext[] = $derived(
		selectedTab === 'active'
			? $chats.filter((chat) => chat.isActive)
			: selectedTab === 'notActive'
				? $chats.filter((chat) => !chat.isActive)
				: $chats
						.sort((a, b) => a.title.localeCompare(b.title))
						.sort((a, b) => (a.isActive ? -1 : 1))
	)
</script>

<div class="flex h-screen w-full">
	<div class="flex w-80 flex-col border-r">
		<div class="flex w-full items-center justify-between p-4">
			<p class="font-title text-2xl font-bold">Chats</p>
			<Button size="icon" onclick={handleCreateChat}><Plus /></Button>
		</div>
		<div>
			<p>Intitulé du chat</p>
		</div>

		<Tabs.Root bind:value={selectedTab} class="w-[400px]">
			<Tabs.List>
				<Tabs.Trigger value="active">Active</Tabs.Trigger>
				<Tabs.Trigger value="notActive">Not Active</Tabs.Trigger>
				<Tabs.Trigger value="all">All</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

		<ScrollArea class="flex h-full flex-col p-4">
			{#each showedChats as chat}
				<div
					class="mb-4 border p-4 last:mb-0"
					onclick={() => printChatInformation(chat.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							printChatInformation(chat.id)
						}
					}}
					role="button"
					tabindex="0"
				>
					<p>{chat.title}</p>
					<p>{chat?.context?.title}</p>
					<p>{chat.isActive ? 'Actif' : 'Hé nan'}</p>
					<Button size="icon" onclick={() => handleEditChat(chat.id)}>Edit</Button>
					<Button size="icon" onclick={() => chats.delete(chat.id)}>Delete</Button>
				</div>
			{/each}
		</ScrollArea>
	</div>

	{#if currentChat}
		<div class="flex-1">
			<p>{currentChat.title}</p>
			<div class="flex w-full flex-col p-4">
				{#each currentChat.messages as message, index}
					<div
						class={cn(
							message.role === 'user' ? 'items-end' : 'items-start',
							'flex flex-col'
						)}
					>
						<p>{message.content}</p>
						<p>{message.role}</p>
					</div>{/each}
			</div>
		</div>
	{/if}
</div>
