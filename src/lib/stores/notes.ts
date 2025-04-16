import { writable } from 'svelte/store'
import type { Note } from '$lib/types/Note'

const createNotesStore = () => {
    const { subscribe, set, update } = writable<Note[]>([])

    return {
        subscribe,
        set,
        update,
        fetch: async () => {
            const response = await fetch('/api/notes')
            const data = await response.json()
            set((data satisfies Note[]) || [])
        },
    }
}

export const notes = createNotesStore()
