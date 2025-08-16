import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'
import type { ChatDTO } from '$lib/stores/chats'

// GET - Lister tous les chats de l'utilisateur
export const GET: RequestHandler = authenticatedApi(async ({ request }, user) => {
	const chats = await prisma.chat.findMany({
		where: {
			userId: user.id,
			// isActive: true,
		},
		include: {
			context: {
				select: {
					id: true,
					title: true,
				},
			},
			messages: {
				orderBy: {
					createdAt: 'desc',
				},
				take: 1, // Dernier message pour la preview
				select: {
					id: true,
					content: true,
					role: true,
					createdAt: true,
				},
			},
			_count: {
				select: {
					messages: true,
				},
			},
		},
		orderBy: {
			updatedAt: 'desc',
		},
	})

	return new Response(JSON.stringify(chats), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
})

// POST - Créer un nouveau chat
export const POST: RequestHandler = authenticatedApi(async ({ request }, user) => {
	const { title, contextId, isActive = true }: ChatDTO = await request.json()

	// Vérifier que le contexte appartient à l'utilisateur s'il est fourni
	//TODO : Peut être mettre ça dans un wrapper ?
	if (contextId) {
		const context = await prisma.aIContext.findFirst({
			where: {
				id: contextId,
				userId: user.id,
			},
		})

		if (!context) {
			return new Response(
				JSON.stringify({
					error: 'Context not found or unauthorized',
				}),
				{
					status: 404,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
		}
	}

	const chat = await prisma.chat.create({
		data: {
			title: title || 'New Chat',
			userId: user.id,
			contextId: contextId || null,
			isActive,
		},
		include: {
			context: {
				select: {
					id: true,
					title: true,
				},
			},
			messages: true,
			_count: {
				select: {
					messages: true,
				},
			},
		},
	})

	return new Response(JSON.stringify(chat), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
})
