import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const chat = await prisma.chat.findFirst({
			where: {
				id: params.id,
				userId: session.user.id
			},
			include: {
				context: {
					select: {
						id: true,
						title: true,
						prompt: true
					}
				},
				messages: {
					orderBy: {
						createdAt: 'asc'
					}
				}
			}
		});

		if (!chat) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		return json(chat);
	} catch (error) {
		console.error('Error fetching chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};