import type { PageServerLoad } from './$types'
import type { Note } from '$lib/types/Note'
export const load = (async () => {
    return {
        notes: [
            {
                id: '1',
                title: 'Note 1',
                content: 'Content 1',
            },
            {
                id: '2',
                title: 'Note 2',
                content: 'Content 2',
            },
        ] as Note[],
    }
}) satisfies PageServerLoad
