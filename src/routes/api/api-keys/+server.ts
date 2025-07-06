import type { RequestHandler } from './$types'
import prisma from '$lib/server/prisma'
import { authenticatedApi } from '$lib/server/authUtils'

// Fonction pour générer un token sécurisé
import { randomBytes } from 'crypto'

// Fonction pour générer un token sécurisé
function generateApiToken(): string {
    const tokenBytes = randomBytes(32)
    return `mcp_${tokenBytes.toString('hex')}`
}

// GET - Lister toutes les clés API de l'utilisateur
export const GET: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                name: true,
                token: true, // On peut masquer partiellement le token si souhaité
                createdAt: true,
                lastUsedAt: true,
                expiresAt: true,
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Masquer partiellement les tokens pour la sécurité
        const maskedApiKeys = apiKeys.map((key) => ({
            ...key,
            token: `${key.token.substring(0, 8)}...${key.token.substring(key.token.length - 4)}`,
        }))

        return new Response(JSON.stringify(maskedApiKeys), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)

// POST - Créer une nouvelle clé API
export const POST: RequestHandler = authenticatedApi(
    async ({ request }, user) => {
        const { name, expiresAt } = await request.json()

        if (!name || name.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Le nom est requis' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        // Générer un token sécurisé
        const token = generateApiToken()

        const apiKey = await prisma.apiKey.create({
            data: {
                name: name.trim(),
                token,
                userId: user.id,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        })

        return new Response(JSON.stringify(apiKey), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
)
