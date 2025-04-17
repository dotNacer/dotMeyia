export interface Note {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
}

export interface NoteDTO {
    title: string
    content: string
}
