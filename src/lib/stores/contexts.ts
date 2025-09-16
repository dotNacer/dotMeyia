import { getFromLocalStorage, saveToLocalStorage } from '$lib/utils'
import { writable } from 'svelte/store'
import type { AIContext, Note } from '@prisma/client'
import {
	getContexts,
	getContext,
	createContext,
	updateContext,
	deleteContext,
} from '$lib/contexts.remote'

type ContextDTO = Pick<AIContext, 'title' | 'prompt'>
type ContextWithNotes = AIContext & { notes: Note[] }

const FAVORITE_CONTEXT_KEY = 'favoriteContextId'

const createContextsStore = () => {
	const { subscribe, set, update } = writable<ContextWithNotes[]>([])

	const favoriteContextId = writable<string | null>(getFromLocalStorage(FAVORITE_CONTEXT_KEY))

	// TODO : Wrapper dans un tryCatch
	return {
		subscribe,
		set,
		update,
		selected: {
			// Sélectionner le contexte préferé
			select: (id: string) => {
				favoriteContextId.set(id)
				saveToLocalStorage(FAVORITE_CONTEXT_KEY, id)
			},

			// Unfavorite le contexte préf
			clear: () => {
				favoriteContextId.set(null)
				saveToLocalStorage(FAVORITE_CONTEXT_KEY, null)
			},

			// Get the ID
			get: () => {
				return getFromLocalStorage(FAVORITE_CONTEXT_KEY)
			},
		},
		fetch: async () => {
			const contexts = await getContexts()
			set(contexts)
		},
		get: async (id: string) => {
			const context = await getContext(id)
			return context
		},
		edit: async (id: string, context: ContextDTO, notes: Note[]) => {
			const updatedContext = await updateContext({
				id,
				...context,
				notes_ids: notes.map((note) => note.id),
			})
			if (updatedContext)
				update((contexts) => contexts.map((c) => (c.id === id ? updatedContext : c)))

			return updatedContext
		},
		create: async (context: ContextDTO, notes: Note[]) => {
			const newContext = await createContext({
				...context,
				notes_ids: notes.map((note) => note.id),
			})
			update((contexts) => [...contexts, newContext])
			return newContext
		},
		delete: async (id: string) => {
			const success = await deleteContext(id)
			if (success) update((contexts) => contexts.filter((context) => context.id !== id))

			return success
		},
	}
}

export const contexts = createContextsStore()
