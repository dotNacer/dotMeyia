import { createAuthClient } from 'better-auth/svelte'
import { env } from '$env/dynamic/public'

// Impropre, utiliser l'env a la place

export const authClient = createAuthClient({
    baseURL: env.PUBLIC_BETTER_AUTH_URL,
})
