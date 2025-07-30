import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'
import type { User } from 'better-auth'

export const GET: RequestHandler = authenticatedApi(async (event, user: User) => {
	try {
		const chat = await prisma.chat.findFirst({
			where: {
				id: event.params.id,
				userId: user.id,
			},
			include: {
				context: {
					select: {
						id: true,
						title: true,
						prompt: true,
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
			return json({ error: 'Chat not found' }, { status: 404 })
		}

		return json(chat)
	} catch (error) {
		console.error('Error fetching chat:', error)
		return json({ error: 'Internal server error' }, { status: 500 })
	}
})
