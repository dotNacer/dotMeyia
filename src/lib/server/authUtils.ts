import { auth } from '$lib/server/auth'
import type { RequestEvent, RequestHandler } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import type { User } from 'better-auth'

/**
 * Wrapper to handle session authentication for API routes or server load functions.
 * Retrieves the session and checks for a valid user ID.
 *
 * @param event - The RequestEvent object from SvelteKit.
 * @returns The authenticated session object.
 * @throws Will throw a 401 error if the user is not authenticated.
 */
export async function requireAuth(event: RequestEvent): Promise<User> {
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
