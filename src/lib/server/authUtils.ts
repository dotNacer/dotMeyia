import { auth } from '$lib/server/auth'
import prisma from '$lib/server/prisma'
import type { RequestEvent, RequestHandler } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import type { User } from 'better-auth'

/**
 * Checks if the request has a valid API key and returns the associated user.
 *
 * @param event - The RequestEvent object from SvelteKit.
 * @returns The user associated with the API key, or null if invalid.
 */
async function checkApiKeyAuth(event: RequestEvent): Promise<User | null> {
    const authHeader = event.request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Basic token validation
    if (!token || token.length < 10 || token.includes(' ')) {
        return null
    }

    let apiKey
    try {
        apiKey = await prisma.apiKey.findUnique({
            where: {
                token: token,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        // Add other needed user fields but exclude sensitive data
                    },
                },
            },
        })
    } catch (error) {
        console.error('Database error during API key authentication:', error)
        return null
    }

    if (!apiKey || !apiKey.user) {
        return null
    }

    // Check if API key has expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return null
    }

    // Update last used timestamp asynchronously to avoid blocking authentication
    prisma.apiKey
        .update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        })
        .catch((error) => {
            console.error(
                'Failed to update API key last used timestamp:',
                error
            )
        })

    return apiKey.user as User
}

/**
 * Wrapper to handle session authentication for API routes or server load functions.
 * Retrieves the session and checks for a valid user ID, or checks for a valid API key.
 *
 * @param event - The RequestEvent object from SvelteKit.
 * @returns The authenticated user object.
 * @throws Will throw a 401 error if the user is not authenticated.
 */
export async function requireAuth(event: RequestEvent): Promise<User> {
    // First, try API key authentication
    const apiUser = await checkApiKeyAuth(event)
    if (apiUser) {
        return apiUser
    }

    // If no API key, try session authentication
    const session = await auth.api.getSession({
        headers: event.request.headers,
    })

    // Check if session and user id exist
    if (!session?.user?.id) {
        throw error(401, 'Unauthorized')
    }

    // We know session and session.user are defined here due to the check above
    // Cast to AuthenticatedSession, assuming getSession structure matches
    return session.user as User
}

/**
 * Higher-order function to wrap a RequestHandler with authentication.
 * Ensures that the user is authenticated before executing the handler.
 *
 * @param handler - The RequestHandler function to wrap, receiving the event and authenticated user.
 * @returns A new RequestHandler that includes the authentication check.
 */
export function authenticatedApi(
    handler: (event: RequestEvent, user: User) => Response | Promise<Response>
): RequestHandler {
    return async (event) => {
        const user = await requireAuth(event) // Throws 401 if not authenticated
        return handler(event, user)
    }
}
