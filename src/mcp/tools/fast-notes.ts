import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import prisma from '../db.js'
import { generateEmbedding, formatNoteForEmbedding } from '../embeddings.js'
import type { McpUser } from '../auth.js'

const TOP_K = 5
const MIN_SIMILARITY = 0.3

export function registerFastNoteTools(
	server: McpServer,
	getUser: (sessionId: string) => McpUser
) {
	server.tool(
		'create_fast_note',
		'Créer une note rapide. Fusionne automatiquement avec une note existante similaire, ou crée une nouvelle note si aucune correspondance.',
		{
			content: z.string().min(1).describe('Contenu de la note rapide'),
			noteId: z.string().optional().describe('ID d\'une note existante pour forcer la fusion (optionnel)'),
		},
		async ({ content, noteId }, extra) => {
			const user = getUser(extra.sessionId!)

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
					return {
						content: [{ type: 'text' as const, text: 'Note cible non trouvée' }],
						isError: true,
					}
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
				const embedding = await generateEmbedding(content)
				const vectorStr = `[${embedding.join(',')}]`

				const results = await prisma.$queryRaw<
					{ id: string; title: string; similarity: number }[]
				>`
					SELECT n.id, n.title,
						1 - (n.embedding <=> ${vectorStr}::vector) as similarity
					FROM "note" n
					WHERE n."userId" = ${user.id} AND n.embedding IS NOT NULL
					ORDER BY n.embedding <=> ${vectorStr}::vector
					LIMIT ${TOP_K}
				`

				const bestMatch = results[0]
				const shouldCreateNew = !bestMatch || Number(bestMatch.similarity) < MIN_SIMILARITY

				if (shouldCreateNew) {
					const title = content.slice(0, 80) + (content.length > 80 ? '...' : '')
					const newNote = await prisma.note.create({
						data: {
							title,
							content: `[${dateStr} - ${content}]`,
							userId: user.id,
						},
					})

					const text = formatNoteForEmbedding(newNote.title, newNote.content)
					const emb = await generateEmbedding(text)
					const vec = `[${emb.join(',')}]`
					await prisma.$executeRaw`
						UPDATE "note" SET "embedding" = ${vec}::vector WHERE "id" = ${newNote.id}
					`

					note = newNote
					targetNoteId = newNote.id
				} else {
					const existingNote = await prisma.note.findUnique({
						where: { id: bestMatch.id },
					})
					const appendedContent = `\n\n[${dateStr} - ${content}]`
					const newContent = (existingNote?.content ?? '') + appendedContent
					await prisma.note.update({
						where: { id: bestMatch.id },
						data: { content: newContent },
					})

					const text = formatNoteForEmbedding(bestMatch.title, newContent)
					const emb = await generateEmbedding(text)
					const vec = `[${emb.join(',')}]`
					await prisma.$executeRaw`
						UPDATE "note" SET "embedding" = ${vec}::vector WHERE "id" = ${bestMatch.id}
					`

					note = { id: bestMatch.id, title: bestMatch.title, content: newContent }
					targetNoteId = bestMatch.id
				}
			}

			await prisma.$executeRaw`
				INSERT INTO "fast_note" (id, content, "noteId", "userId", "createdAt")
				VALUES (gen_random_uuid(), ${content}, ${targetNoteId}, ${user.id}, NOW())
			`

			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify(
							{ success: true, noteId: targetNoteId, title: note.title },
							null,
							2
						),
					},
				],
			}
		}
	)
}
