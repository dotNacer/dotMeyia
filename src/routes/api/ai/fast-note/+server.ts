import { json } from '@sveltejs/kit'
import { requireAuth } from '$lib/server/authUtils'
import prisma from '$lib/server/prisma'
import { generateEmbedding } from '$lib/server/embeddings'
import { indexNote } from '$lib/server/noteIndexer'
import type { RequestEvent } from '@sveltejs/kit'
import type { FastNoteResponse } from '$lib/types/fast-note'

const TOP_K = 5
const MIN_SIMILARITY = 0.3

/**
 * POST: Recherche les notes les plus similaires au contenu Fast Note
 * Body: { content: string }
 */
export async function POST(event: RequestEvent) {
	const user = await requireAuth(event)

	const body = await event.request.json().catch(() => ({}))
	const content = typeof body?.content === 'string' ? body.content.trim() : ''

	if (!content) {
		return json({ error: 'content is required' }, { status: 400 })
	}

	const embedding = await generateEmbedding(content)
	const vectorStr = `[${embedding.join(',')}]`

	const results = await prisma.$queryRaw<{ id: string; title: string; similarity: number }[]>`
		SELECT 
			n.id,
			n.title,
			1 - (n.embedding <=> ${vectorStr}::vector) as similarity
		FROM "note" n
		WHERE n."userId" = ${user.id}
		  AND n.embedding IS NOT NULL
		ORDER BY n.embedding <=> ${vectorStr}::vector
		LIMIT ${TOP_K}
	`

	const candidates: FastNoteMatch[] = results.map((r) => ({
		noteId: r.id,
		title: r.title,
		similarity: Number(r.similarity),
	}))

	const bestMatch = candidates[0]
	const createNew = !bestMatch || bestMatch.similarity < MIN_SIMILARITY

	return json({ candidates, createNew } satisfies FastNoteResponse)
}

/**
 * PUT: Fusionne le contenu Fast Note dans une note (existante ou nouvelle) et enregistre l'historique
 * Body: { content: string, noteId?: string }
 * - Si noteId: fusion dans la note existante (format [Date - Contenu])
 * - Si pas de noteId (createNew): crée une nouvelle note avec le contenu
 */
export async function PUT(event: RequestEvent) {
	const user = await requireAuth(event)

	const body = await event.request.json().catch(() => ({}))
	const content = typeof body?.content === 'string' ? body.content.trim() : ''
	const noteId = typeof body?.noteId === 'string' ? body.noteId : null

	if (!content) {
		return json({ error: 'content is required' }, { status: 400 })
	}

	const dateStr = new Date().toLocaleString('fr-FR', {
		dateStyle: 'short',
		timeStyle: 'short',
	})

	let targetNoteId: string
	let note: { id: string; title: string; content: string }

	if (noteId) {
		const existingNote = await prisma.note.findFirst({
			where: { id: noteId, userId: user.id },
		})
		if (!existingNote) {
			return json({ error: 'Note not found' }, { status: 404 })
		}
		const appendedContent = `\n\n[${dateStr} - ${content}]`
		const newContent = existingNote.content + appendedContent
		await prisma.note.update({
			where: { id: noteId },
			data: { content: newContent },
		})
		note = { ...existingNote, content: newContent }
		targetNoteId = noteId
	} else {
		const title = content.slice(0, 80) + (content.length > 80 ? '...' : '')
		const newNote = await prisma.note.create({
			data: {
				title,
				content: `[${dateStr} - ${content}]`,
				userId: user.id,
			},
		})
		note = newNote
		targetNoteId = newNote.id
	}

	await indexNote(note)

	await prisma.fastNote.create({
		data: {
			content,
			noteId: targetNoteId,
			userId: user.id,
		},
	})

	return json({
		success: true,
		noteId: targetNoteId,
		note,
	})
}
