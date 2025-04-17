import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper

export const GET: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        const note = await prisma.note.findUnique({
            where: { id: params.id, userId: user.id },
        })

        return new Response(JSON.stringify(note), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const PUT: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const data = await request.json()

        const note = await prisma.note.update({
            where: {
                id: params.id,
                userId: user.id,
            },
            data: {
                title: data.title,
                content: data.content,
                updatedAt: new Date(),
            },
        })

        return new Response(JSON.stringify(note), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
