import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper

export const GET: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        const category = await prisma.category.findUnique({
            where: { id: params.id, userId: user.id },
        })
        return new Response(JSON.stringify(category), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const PUT: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const { title, weight } = await request.json()
        const category = await prisma.category.update({
            where: { id: params.id, userId: user.id },
            data: { title, weight },
        })
        return new Response(JSON.stringify(category), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const DELETE: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        await prisma.category.delete({
            where: { id: params.id, userId: user.id },
        })
        return new Response(null, {
            status: 204,
        })
    }
)
