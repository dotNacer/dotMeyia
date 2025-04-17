import { writable } from 'svelte/store'
import type { Note, NoteDTO } from '$lib/types/Note'

const createNotesStore = () => {
    const { subscribe, set, update } = writable<Note[]>([])

    // TODO : Wrapper dans un tryCatch
    return {
        subscribe,
        set,
        update,
        fetch: async () => {
            const response = await fetch('/api/notes')
            const data = await response.json()
            set((data satisfies Note[]) || [])
        },
        get: async (id: string) => {
            const response = await fetch(`/api/notes/${id}`)
            const data = await response.json()
            return data satisfies Note | null
        },
        edit: async (id: string, note: NoteDTO) => {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(note),
            })
            const data = await response.json()
            update((notes) =>
                notes.map((note) =>
                    note.id === id ? (data satisfies Note) : note
                )
            )
        },
        create: async (note: NoteDTO) => {
            const response = await fetch('/api/notes', {
                method: 'POST',
                body: JSON.stringify(note),
            })
            const data = await response.json()
            update((notes) => [...notes, data satisfies Note])
            return data satisfies Note
        },
        deleteAll: async () => {
            await fetch('/api/notes', {
                method: 'DELETE',
            })
            set([])
        },
    }
}

export const notes = createNotesStore()
