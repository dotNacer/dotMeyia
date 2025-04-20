import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper
import type { Note } from '@prisma/client'
export const GET: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        const context = await prisma.aIContext.findUnique({
            where: { id: params.id, userId: user.id },
            include: {
                notes: true,
            },
        })

        return new Response(JSON.stringify(context), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const PUT: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const data = await request.json()
        const context = await prisma.aIContext.update({
            where: { id: params.id, userId: user.id },
            data: {
                title: data.title,
                prompt: data.prompt,
                notes: {
                    set: data.notes_ids.map((id: string) => ({ id })),
                },
            },
            include: {
                notes: true,
            },
        })

        return new Response(JSON.stringify(context), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const DELETE: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        await prisma.aIContext.delete({
            where: { id: params.id, userId: user.id },
        })

        return new Response(null, {
            status: 204,
        })
    }
)
