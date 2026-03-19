import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import prisma from '../db.js'
import type { McpUser } from '../auth.js'

export function registerCategoryTools(
	server: McpServer,
	getUser: (sessionId: string) => McpUser
) {
	server.tool(
		'list_categories',
		'Lister toutes les catégories de l\'utilisateur',
		{},
		async (_args, extra) => {
			const user = getUser(extra.sessionId!)
			const categories = await prisma.category.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: 'desc' },
			})
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(categories, null, 2) }],
			}
		}
	)

	server.tool(
		'create_category',
		'Créer une nouvelle catégorie',
		{
			title: z.string().min(1).describe('Nom de la catégorie'),
			weight: z.number().min(0).max(1).describe('Poids de la catégorie (entre 0 et 1)'),
		},
		async ({ title, weight }, extra) => {
			const user = getUser(extra.sessionId!)
			const category = await prisma.category.create({
				data: { title, weight, userId: user.id },
			})
			return {
				content: [{ type: 'text' as const, text: JSON.stringify(category, null, 2) }],
			}
		}
	)
}
