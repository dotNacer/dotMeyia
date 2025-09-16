import { writable } from 'svelte/store'
import type { Note } from '@prisma/client'
import { getNotes, getNote, createNote, updateNote, deleteNote } from '$lib/notes.remote'

type NoteDTO = Pick<Note, 'title' | 'content'>
const createNotesStore = () => {
	const { subscribe, set, update } = writable<Note[]>([])

	// TODO : Wrapper dans un tryCatch
	return {
		subscribe,
		set,
		update,
		fetch: async () => {
			const notes = await getNotes()
			set(notes)
		},
		get: async (id: string) => {
			const note = await getNote(id)
			return note
		},
		edit: async (id: string, note: NoteDTO) => {
			const updatedNote = await updateNote({ id, ...note })
			if (updatedNote) update((notes) => notes.map((n) => (n.id === id ? updatedNote : n)))
			return updatedNote
		},
		create: async (note: NoteDTO) => {
			const newNote = await createNote(note)
			update((notes) => [...notes, newNote])
			return newNote
		},
		delete: async (id: string) => {
			const success = await deleteNote(id)
			if (success) update((notes) => notes.filter((note) => note.id !== id))
			return success
		},
	}
}

export const notes = createNotesStore()
