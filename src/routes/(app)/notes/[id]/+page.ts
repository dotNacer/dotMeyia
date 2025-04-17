import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }: { params: { id: string } }) => {
    return {
        id: params.id,
    }
}
