import prisma from '$lib/server/prisma'
import { generateEmbedding, formatNoteForEmbedding } from './embeddings'
import type { Note } from '@prisma/client'

/**
 * Indexe une note en générant son embedding et en le stockant en base.
 * Appelé de manière synchrone après create/update de note.
 */
export async function indexNote(note: Pick<Note, 'id' | 'title' | 'content'>): Promise<void> {
	const text = formatNoteForEmbedding(note.title, note.content)
	const embedding = await generateEmbedding(text)

	// Format pgvector: '[0.1, 0.2, ...]'
	const vectorStr = `[${embedding.join(',')}]`

	await prisma.$executeRaw`
		UPDATE "note"
		SET "embedding" = ${vectorStr}::vector
		WHERE "id" = ${note.id}
	`
}
