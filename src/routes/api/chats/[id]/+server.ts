import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'

// GET - Récupérer un chat spécifique
export const GET: RequestHandler = authenticatedApi(async ({ params }, user) => {
	const chat = await prisma.chat.findFirst({
		where: {
			id: params.id,
			userId: user.id,
			// isActive: true,
		},
		include: {
			context: {
				include: {
					notes: true,
				},
			},
			messages: {
				orderBy: {
					createdAt: 'asc',
				},
			},
		},
	})

	if (!chat) {
		return new Response(JSON.stringify({ error: 'Chat not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	return new Response(JSON.stringify(chat), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
})

// PUT - Mettre à jour un chat
export const PUT: RequestHandler = authenticatedApi(async ({ params, request }, user) => {
	const { title, contextId } = await request.json()

	// Vérifier que le chat appartient à l'utilisateur
	const existingChat = await prisma.chat.findFirst({
		where: {
			id: params.id,
			userId: user.id,
		},
	})

	if (!existingChat) {
		return new Response(JSON.stringify({ error: 'Chat not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	// Vérifier que le contexte appartient à l'utilisateur s'il est fourni
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

	const chat = await prisma.chat.update({
		where: {
			id: params.id,
		},
		data: {
			title: title || existingChat.title,
			contextId: contextId !== undefined ? contextId : existingChat.contextId,
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
					createdAt: 'asc',
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

// DELETE - Supprimer un chat (soft delete)
export const DELETE: RequestHandler = authenticatedApi(async ({ params }, user) => {
	// Vérifier que le chat appartient à l'utilisateur
	const existingChat = await prisma.chat.findFirst({
		where: {
			id: params.id,
			userId: user.id,
		},
	})

	if (!existingChat) {
		return new Response(JSON.stringify({ error: 'Chat not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	// Soft delete - marquer comme inactif
	await prisma.chat.update({
		where: {
			id: params.id,
		},
		data: {
			isActive: false,
		},
	})

	return new Response(null, {
		status: 204,
	})
})
