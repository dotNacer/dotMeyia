import type { IncomingMessage } from 'node:http'
import prisma from './db.js'

export interface McpUser {
	id: string
	name: string
	email: string
}

export async function authenticateRequest(req: IncomingMessage): Promise<McpUser | null> {
	const authHeader = req.headers['authorization']
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null
	}

	const token = authHeader.substring(7)
	if (!token || token.length < 10 || token.includes(' ')) {
		return null
	}

	let apiKey
	try {
		apiKey = await prisma.apiKey.findUnique({
			where: { token, isActive: true },
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		})
	} catch (err) {
		console.error('[MCP Auth] Database error:', err)
		return null
	}

	if (!apiKey?.user) return null

	if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
		return null
	}

	prisma.apiKey
		.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
		.catch((err) => console.error('[MCP Auth] Failed to update lastUsedAt:', err))

	return apiKey.user as McpUser
}
