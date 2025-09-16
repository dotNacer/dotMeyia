import { query, command, getRequestEvent } from '$app/server'
import { requireAuth } from '$lib/server/authUtils'
import prisma from '$lib/server/prisma'
import type { Note } from '@prisma/client'
import * as v from 'valibot'

const noteIdSchema = v.pipe(v.string(), v.minLength(1))
const createNoteSchema = v.object({
	title: v.pipe(v.string(), v.minLength(1)),
	content: v.string(),
})

export const getNotes = query(async (): Promise<Note[]> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	const notes = await prisma.note.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: 'desc' },
	})

	return notes
})

export const getNote = query(noteIdSchema, async (id: string): Promise<Note | null> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	const note = await prisma.note.findFirst({
		where: {
			id,
			userId: user.id,
		},
	})

	return note
})

export const createNote = command(
	createNoteSchema,
	async ({ title, content }: { title: string; content: string }): Promise<Note> => {
		const event = getRequestEvent()
		const user = await requireAuth(event)

		const note = await prisma.note.create({
			data: {
				title,
				content,
				userId: user.id,
			},
		})

		return note
	}
)

export const updateNote = command(
	v.object({
		id: v.pipe(v.string(), v.minLength(1)),
		title: v.optional(v.pipe(v.string(), v.minLength(1))),
		content: v.optional(v.string()),
	}),
	async ({
		id,
		title,
		content,
	}: {
		id: string
		title?: string
		content?: string
	}): Promise<Note | null> => {
		const event = getRequestEvent()
		const user = await requireAuth(event)

		const existingNote = await prisma.note.findFirst({
			where: { id, userId: user.id },
		})

		if (!existingNote) return null

		const updateData: Partial<{ title: string; content: string }> = {}
		if (title !== undefined) updateData.title = title
		if (content !== undefined) updateData.content = content

		const updatedNote = await prisma.note.update({
			where: { id },
			data: updateData,
		})

		return updatedNote
	}
)

export const deleteNote = command(noteIdSchema, async (id: string): Promise<boolean> => {
	const event = getRequestEvent()
	const user = await requireAuth(event)

	const existingNote = await prisma.note.findFirst({
		where: { id, userId: user.id },
	})

	if (!existingNote) return false

	await prisma.note.delete({
		where: { id },
	})

	return true
})
