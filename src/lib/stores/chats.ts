import { writable } from 'svelte/store'
import type { AIContext, Chat, Message } from '@prisma/client'

export type ChatDTO = Omit<Chat, 'id' | 'createdAt' | 'updatedAt' | 'userId'>

export type ChatWithContext = Chat & {
	context?: AIContext
	messages: Message[]
}

const createChatsStore = () => {
	const { subscribe, set, update } = writable<ChatWithContext[]>([])

	return {
		subscribe,
		set,
		update,
		fetch: async () => {
			const response = await fetch('/api/chats')
			const data = await response.json()
			set((data satisfies ChatWithContext[]) || [])
		},
		get: async (id: string) => {
			const response = await fetch(`/api/chats/${id}`)
			const data = await response.json()
			return data satisfies ChatWithContext
		},
		create: async (chat: ChatDTO) => {
			const response = await fetch('/api/chats', {
				method: 'POST',
				body: JSON.stringify(chat),
			})
			const data = await response.json()
			update((chats) => [...chats, data satisfies ChatWithContext])
			return data satisfies ChatWithContext
		},
		edit: async (id: string, chat: ChatDTO) => {
			const response = await fetch(`/api/chats/${id}`, {
				method: 'PUT',
				body: JSON.stringify(chat),
			})
			const data = await response.json()
			update((chats) => chats.map((c) => (c.id === id ? data : c)))
		},
		delete: async (id: string) => {
			await fetch(`/api/chats/${id}`, { method: 'DELETE' })
			update((chats) => chats.filter((chat) => chat.id !== id))
		},
	}
}

export const chats = createChatsStore()
