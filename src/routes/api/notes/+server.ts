import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils' // Import the wrapper

// Wrap the handler with authenticatedApi
export const GET: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const notes = await prisma.note.findMany({
            where: {
                userId: user.id, // Use the user ID from the validated session
            },
        })

        return new Response(JSON.stringify(notes), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

export const POST: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const { title, content } = await request.json()
        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId: user.id,
            },
        })
        return new Response(JSON.stringify(note), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

// Ne pas laisser
export const DELETE: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        await prisma.note.deleteMany({
            where: { userId: user.id },
        })
        return new Response(JSON.stringify({ message: 'Notes deleted' }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
