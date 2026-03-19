import { json } from '@sveltejs/kit'
import { requireAuth } from '$lib/server/authUtils'
import prisma from '$lib/server/prisma'
import type { RequestEvent } from '@sveltejs/kit'
import type { FastNoteHistoryItem } from '$lib/types/fast-note'

/**
 * GET: Récupère l'historique des Fast Notes de l'utilisateur (timeline)
 */
export async function GET(event: RequestEvent) {
	const user = await requireAuth(event)

	const fastNotes = await prisma.fastNote.findMany({
		where: { userId: user.id },
		include: {
			note: { select: { title: true } },
		},
		orderBy: { createdAt: 'desc' },
		take: 50,
	})

	const items: FastNoteHistoryItem[] = fastNotes.map((fn) => ({
		id: fn.id,
		content: fn.content,
		noteId: fn.noteId,
		noteTitle: fn.note.title,
		createdAt: fn.createdAt.toISOString(),
	}))

	return json({ items })
}
