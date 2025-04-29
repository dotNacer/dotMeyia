import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper

export const GET: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const categories = await prisma.category.findMany({
            where: { userId: user.id },
        })
        return new Response(JSON.stringify(categories), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const POST: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const { title, weight } = await request.json()
        const category = await prisma.category.create({
            data: { title, weight, userId: user.id },
        })
        return new Response(JSON.stringify(category), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
