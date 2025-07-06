import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'

// DELETE - Supprimer une clé API
export const DELETE: RequestHandler = authenticatedApi(
    async ({ params }, user) => {
        const apiKeyId = params.id

        // Vérifier que la clé API appartient à l'utilisateur
        const apiKey = await prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                userId: user.id,
            },
        })

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Clé API non trouvée' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        await prisma.apiKey.delete({
            where: { id: apiKeyId },
        })

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

// PATCH - Mettre à jour une clé API (activer/désactiver)
export const PATCH: RequestHandler = authenticatedApi(
    async ({ params, request }, user) => {
        const apiKeyId = params.id
        const { isActive } = await request.json()

        // Vérifier que la clé API appartient à l'utilisateur
        const apiKey = await prisma.apiKey.findFirst({
            where: {
                id: apiKeyId,
                userId: user.id,
            },
        })

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'Clé API non trouvée' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        const updatedApiKey = await prisma.apiKey.update({
            where: { id: apiKeyId },
            data: { isActive },
        })

        return new Response(JSON.stringify(updatedApiKey), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
