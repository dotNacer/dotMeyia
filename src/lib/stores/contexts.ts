import { getFromLocalStorage, saveToLocalStorage } from '$lib/utils'
import { writable } from 'svelte/store'
import type { AIContext, Note } from '@prisma/client'

type ContextDTO = Pick<AIContext, 'title' | 'prompt'>
type ContextWithNotes = AIContext & { notes: Note[] }

const FAVORITE_CONTEXT_KEY = 'favoriteContextId'

const createContextsStore = () => {
    const { subscribe, set, update } = writable<ContextWithNotes[]>([])

    const favoriteContextId = writable<string | null>(
        getFromLocalStorage(FAVORITE_CONTEXT_KEY)
    )

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
            const response = await fetch('/api/contexts')
            const data = await response.json()
            set((data satisfies ContextWithNotes[]) || [])
        },
        get: async (id: string) => {
            const response = await fetch(`/api/contexts/${id}`)
            const data = await response.json()
            return data satisfies ContextWithNotes | null
        },
        edit: async (id: string, context: ContextDTO, notes: Note[]) => {
            const response = await fetch(`/api/contexts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...context,
                    notes_ids: notes.map((note) => note.id),
                }),
            })
            const data = await response.json()
            update((contexts) =>
                contexts.map((context) =>
                    context.id === id ? { ...data, notes } : context
                )
            )
        },
        create: async (context: ContextDTO, notes: Note[]) => {
            const response = await fetch('/api/contexts', {
                method: 'POST',
                body: JSON.stringify({
                    ...context,
                    notes_ids: notes.map((note) => note.id),
                }),
            })
            const data = await response.json()
            const contextWithNotes = {
                ...data,
                notes,
            } satisfies ContextWithNotes
            update((contexts) => [...contexts, contextWithNotes])
            return contextWithNotes
        },
        delete: async (id: string) => {
            await fetch(`/api/contexts/${id}`, {
                method: 'DELETE',
            })
            update((contexts) =>
                contexts.filter((context) => context.id !== id)
            )
        },
    }
}

export const contexts = createContextsStore()
