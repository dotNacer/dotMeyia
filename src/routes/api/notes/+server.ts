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

// You can wrap other methods (POST, PUT, DELETE) similarly
// export const POST: RequestHandler = authenticatedApi(async ({ request }, session) => {
//    // ... your logic here, using session.user.id
// });
