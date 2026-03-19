import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import prisma from '../db.js'
import { generateEmbedding, formatNoteForEmbedding } from '../embeddings.js'
import type { McpUser } from '../auth.js'

const TOP_K = 5
const MIN_SIMILARITY = 0.3

export function registerNoteTools(
	server: McpServer,
	getUser: (sessionId: string) => McpUser
) {
	server.tool(
		'list_notes',
		'Lister toutes les notes de l\'utilisateur',
		{},
		async (_args, extra) => {
			const user = getUser(extra.sessionId!)
			const notes = await prisma.note.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: 'desc' },
				select: { id: true, title: true, createdAt: true, updatedAt: true },
			})
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(notes, null, 2) }],
			}
		}
	)

	server.tool(
		'get_note',
		'Obtenir le contenu complet d\'une note par son ID',
		{ id: z.string().describe('ID de la note') },
		async ({ id }, extra) => {
			const user = getUser(extra.sessionId!)
			const note = await prisma.note.findFirst({
				where: { id, userId: user.id },
				include: { categories: true },
			})
			if (!note) {
				return {
					content: [{ type: 'text' as const, text: 'Note non trouvée' }],
					isError: true,
				}
			}
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(note, null, 2) }],
			}
		}
	)

	server.tool(
		'create_note',
		'Créer une nouvelle note',
		{
			title: z.string().min(1).describe('Titre de la note'),
			content: z.string().describe('Contenu de la note'),
		},
		async ({ title, content }, extra) => {
			const user = getUser(extra.sessionId!)
			const note = await prisma.note.create({
				data: { title, content, userId: user.id },
			})

			const text = formatNoteForEmbedding(note.title, note.content)
			const embedding = await generateEmbedding(text)
			const vectorStr = `[${embedding.join(',')}]`
			await prisma.$executeRaw`
				UPDATE "note" SET "embedding" = ${vectorStr}::vector WHERE "id" = ${note.id}
			`

			return {
				content: [{ type: 'text' as const, text: JSON.stringify(note, null, 2) }],
			}
		}
	)

	server.tool(
		'update_note',
		'Modifier une note existante',
		{
			id: z.string().describe('ID de la note'),
			title: z.string().min(1).optional().describe('Nouveau titre'),
			content: z.string().optional().describe('Nouveau contenu'),
		},
		async ({ id, title, content }, extra) => {
			const user = getUser(extra.sessionId!)
			const existing = await prisma.note.findFirst({ where: { id, userId: user.id } })
			if (!existing) {
				return {
					content: [{ type: 'text' as const, text: 'Note non trouvée' }],
					isError: true,
				}
			}

			const updateData: Record<string, string> = {}
			if (title !== undefined) updateData.title = title
			if (content !== undefined) updateData.content = content

			const updated = await prisma.note.update({ where: { id }, data: updateData })

			const text = formatNoteForEmbedding(updated.title, updated.content)
			const embedding = await generateEmbedding(text)
			const vectorStr = `[${embedding.join(',')}]`
			await prisma.$executeRaw`
				UPDATE "note" SET "embedding" = ${vectorStr}::vector WHERE "id" = ${updated.id}
			`

			return {
				content: [{ type: 'text' as const, text: JSON.stringify(updated, null, 2) }],
			}
		}
	)

	server.tool(
		'delete_note',
		'Supprimer une note',
		{ id: z.string().describe('ID de la note à supprimer') },
		async ({ id }, extra) => {
			const user = getUser(extra.sessionId!)
			const existing = await prisma.note.findFirst({ where: { id, userId: user.id } })
			if (!existing) {
				return {
					content: [{ type: 'text' as const, text: 'Note non trouvée' }],
					isError: true,
				}
			}
			await prisma.note.delete({ where: { id } })
			return {
				content: [{ type: 'text' as const, text: `Note "${existing.title}" supprimée` }],
			}
		}
	)

	server.tool(
		'search_notes',
		'Recherche sémantique dans les notes par similarité vectorielle',
		{
			query: z.string().min(1).describe('Texte de recherche'),
			limit: z.number().min(1).max(20).optional().describe('Nombre max de résultats (défaut: 5)'),
		},
		async ({ query, limit }, extra) => {
			const user = getUser(extra.sessionId!)
			const topK = limit ?? TOP_K

			const embedding = await generateEmbedding(query)
			const vectorStr = `[${embedding.join(',')}]`

			const results = await prisma.$queryRaw<
				{ id: string; title: string; content: string; similarity: number }[]
			>`
				SELECT n.id, n.title, n.content,
					1 - (n.embedding <=> ${vectorStr}::vector) as similarity
				FROM "note" n
				WHERE n."userId" = ${user.id} AND n.embedding IS NOT NULL
				ORDER BY n.embedding <=> ${vectorStr}::vector
				LIMIT ${topK}
			`

			const filtered = results.filter((r) => Number(r.similarity) >= MIN_SIMILARITY)

			if (filtered.length === 0) {
				return {
					content: [{ type: 'text' as const, text: 'Aucune note pertinente trouvée' }],
				}
			}

			const formatted = filtered.map((r) => ({
				id: r.id,
				title: r.title,
				content: r.content,
				similarity: Number(r.similarity).toFixed(4),
			}))

			return {
				content: [{ type: 'text' as const, text: JSON.stringify(formatted, null, 2) }],
			}
		}
	)
}
