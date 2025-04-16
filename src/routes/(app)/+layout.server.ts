import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { auth } from '$lib/server/auth'

export const load = (async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    })

    if (!session) throw redirect(307, '/login')

    return { session }
}) satisfies LayoutServerLoad
