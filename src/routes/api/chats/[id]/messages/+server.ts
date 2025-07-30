import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { content } = await request.json();

		if (!content) {
			return json({ error: 'Message content is required' }, { status: 400 });
		}

		// Vérifier que le chat existe et appartient à l'utilisateur
		const chat = await prisma.chat.findFirst({
			where: {
				id: params.id,
				userId: session.user.id
			},
			include: {
				context: {
					select: {
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

		// Sauvegarder le message de l'utilisateur
		const userMessage = await prisma.chatMessage.create({
			data: {
				content,
				role: 'USER',
				chatId: params.id
			}
		});

		// Mettre à jour la date de modification du chat
		await prisma.chat.update({
			where: { id: params.id },
			data: { updatedAt: new Date() }
		});

		// Préparer l'historique des messages pour l'IA
		const messages = chat.messages.map(msg => ({
			role: msg.role.toLowerCase() as 'user' | 'assistant',
			content: msg.content
		}));

		// Ajouter le nouveau message
		messages.push({ role: 'user', content });

		// Créer le système prompt avec le contexte si disponible
		const systemPrompt = chat.context?.prompt || 'Tu es un assistant IA utile et amical.';

		// Générer la réponse de l'IA
		const result = await streamText({
			model: google('gemini-1.5-flash'),
			messages: [
				{ role: 'system', content: systemPrompt },
				...messages
			],
			maxTokens: 1000
		});

		// Sauvegarder la réponse de l'IA
		const assistantMessage = await prisma.chatMessage.create({
			data: {
				content: result.text,
				role: 'ASSISTANT',
				chatId: params.id
			}
		});

		return json({
			userMessage,
			assistantMessage
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};