import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper

// Wrap the handler with authenticatedApi
export const GET: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const context = await prisma.aIContext.findMany({
            where: {
                userId: user.id, // Use the user ID from the validated session
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

export const POST: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const { title, prompt, notes_ids } = await request.json()
        const context = await prisma.aIContext.create({
            data: {
                title,
                prompt,
                userId: user.id,
                notes: {
                    connect: notes_ids.map((id: string) => ({ id })),
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
