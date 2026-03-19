import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import prisma from '../db.js'
import type { McpUser } from '../auth.js'

export function registerContextTools(
	server: McpServer,
	getUser: (sessionId: string) => McpUser
) {
	server.tool(
		'list_contexts',
		'Lister tous les contextes IA de l\'utilisateur',
		{},
		async (_args, extra) => {
			const user = getUser(extra.sessionId!)
			const contexts = await prisma.aIContext.findMany({
				where: { userId: user.id },
				include: { notes: { select: { id: true, title: true } } },
				orderBy: { createdAt: 'desc' },
			})
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(contexts, null, 2) }],
			}
		}
	)

	server.tool(
		'get_context',
		'Obtenir un contexte IA avec ses notes liées',
		{ id: z.string().describe('ID du contexte') },
		async ({ id }, extra) => {
			const user = getUser(extra.sessionId!)
			const context = await prisma.aIContext.findFirst({
				where: { id, userId: user.id },
				include: { notes: true },
			})
			if (!context) {
				return {
					content: [{ type: 'text' as const, text: 'Contexte non trouvé' }],
					isError: true,
				}
			}
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(context, null, 2) }],
			}
		}
	)
}
