import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import prisma from './db.js'
import type { McpUser } from './auth.js'
import { registerNoteTools } from './tools/notes.js'
import { registerCategoryTools } from './tools/categories.js'
import { registerContextTools } from './tools/contexts.js'
import { registerFastNoteTools } from './tools/fast-notes.js'

const sessions = new Map<string, McpUser>()

export function setSessionUser(sessionId: string, user: McpUser) {
	sessions.set(sessionId, user)
}

export function removeSession(sessionId: string) {
	sessions.delete(sessionId)
}

function getUser(sessionId: string): McpUser {
	const user = sessions.get(sessionId)
	if (!user) throw new Error('Session non authentifiée')
	return user
}

export function createMcpServer(): McpServer {
	const server = new McpServer(
		{
			name: 'dotmeyia-mcp',
			version: '1.0.0',
		},
		{
			capabilities: {
				tools: {},
				resources: {},
			},
		}
	)

	registerNoteTools(server, getUser)
	registerCategoryTools(server, getUser)
	registerContextTools(server, getUser)
	registerFastNoteTools(server, getUser)

	server.resource(
		'notes_list',
		'notes://list',
		{ description: 'Liste de toutes les notes (aperçu)' },
		async (uri, extra) => {
			const user = getUser(extra.sessionId!)
			const notes = await prisma.note.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: 'desc' },
				select: { id: true, title: true, createdAt: true, updatedAt: true },
			})
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(notes, null, 2),
					},
				],
			}
		}
	)

	server.resource(
		'note_detail',
		new ResourceTemplate('notes://{id}', { list: undefined }),
		{ description: 'Contenu complet d\'une note' },
		async (uri, params, extra) => {
			const user = getUser(extra.sessionId!)
			const id = params.id as string
			const note = await prisma.note.findFirst({
				where: { id, userId: user.id },
				include: { categories: true },
			})
			if (!note) {
				return {
					contents: [
						{
							uri: uri.href,
							mimeType: 'text/plain',
							text: 'Note non trouvée',
						},
					],
				}
			}
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(note, null, 2),
					},
				],
			}
		}
	)

	return server
}
