import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'

// PUT - Modifier un message
export const PUT: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const { content, metadata } = await request.json()

        // Vérifier que le chat appartient à l'utilisateur
        const chat = await prisma.chat.findFirst({
            where: {
                id: params.id,
                userId: user.id,
                isActive: true,
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

        // Vérifier que le message existe dans ce chat
        const existingMessage = await prisma.message.findFirst({
            where: {
                id: params.messageId,
                chatId: params.id,
            },
        })

        if (!existingMessage) {
            return new Response(
                JSON.stringify({ error: 'Message not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        const message = await prisma.message.update({
            where: {
                id: params.messageId,
            },
            data: {
                content: content || existingMessage.content,
                metadata:
                    metadata !== undefined
                        ? metadata
                        : existingMessage.metadata,
            },
        })

        return new Response(JSON.stringify(message), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

// DELETE - Supprimer un message
export const DELETE: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        // Vérifier que le chat appartient à l'utilisateur
        const chat = await prisma.chat.findFirst({
            where: {
                id: params.id,
                userId: user.id,
                isActive: true,
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

        // Vérifier que le message existe dans ce chat
        const existingMessage = await prisma.message.findFirst({
            where: {
                id: params.messageId,
                chatId: params.id,
            },
        })

        if (!existingMessage) {
            return new Response(
                JSON.stringify({ error: 'Message not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        await prisma.message.delete({
            where: {
                id: params.messageId,
            },
        })

        return new Response(null, {
            status: 204,
        })
    }
)
