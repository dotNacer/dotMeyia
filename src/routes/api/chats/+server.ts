import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const chats = await prisma.chat.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				context: {
					select: {
						id: true,
						title: true
					}
				},
				messages: {
					orderBy: {
						createdAt: 'desc'
					},
					take: 1
				},
				_count: {
					select: {
						messages: true
					}
				}
			},
			orderBy: {
				updatedAt: 'desc'
			}
		});

		return json(chats);
	} catch (error) {
		console.error('Error fetching chats:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { title, contextId } = await request.json();

		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		const chat = await prisma.chat.create({
			data: {
				title,
				userId: session.user.id,
				contextId: contextId || null
			},
			include: {
				context: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		return json(chat);
	} catch (error) {
		console.error('Error creating chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};