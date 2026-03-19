export type FastNoteMatch = {
	noteId: string
	title: string
	similarity: number
}

export type FastNoteResponse = {
	candidates: FastNoteMatch[]
	createNew: boolean
}

export type FastNoteHistoryItem = {
	id: string
	content: string
	noteId: string
	noteTitle: string
	createdAt: string
}
