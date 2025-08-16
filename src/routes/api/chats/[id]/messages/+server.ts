import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'

// GET - Récupérer les messages d'un chat
export const GET: RequestHandler = authenticatedApi(
    async ({ params, url }, user) => {
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '50')
        const skip = (page - 1) * limit

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

        const messages = await prisma.message.findMany({
            where: {
                chatId: params.id!,
            },
            orderBy: {
                createdAt: 'asc',
            },
            skip,
            take: limit,
        })

        const totalMessages = await prisma.message.count({
            where: {
                chatId: params.id!,
            },
        })

        return new Response(
            JSON.stringify({
                messages,
                pagination: {
                    page,
                    limit,
                    total: totalMessages,
                    pages: Math.ceil(totalMessages / limit),
                },
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
)

// POST - Ajouter un message à un chat
export const POST: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const { content, role, metadata } = await request.json()

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

        // Valider le rôle
        if (!['user', 'assistant', 'system'].includes(role)) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid role. Must be user, assistant, or system',
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        const message = await prisma.message.create({
            data: {
                content,
                role,
                chatId: params.id!,
                metadata: metadata || null,
            },
        })

        // Mettre à jour le timestamp du chat
        await prisma.chat.update({
            where: {
                id: params.id,
            },
            data: {
                updatedAt: new Date(),
            },
        })

        return new Response(JSON.stringify(message), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
