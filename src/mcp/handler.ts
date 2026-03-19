import http from 'node:http'
import { randomUUID } from 'node:crypto'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { createMcpServer, setSessionUser, removeSession } from './server.js'
import { authenticateRequest, type McpUser } from './auth.js'

interface SessionEntry {
	transport: StreamableHTTPServerTransport
	server: ReturnType<typeof createMcpServer>
	user: McpUser
}

interface SseSessionEntry {
	transport: SSEServerTransport
	server: ReturnType<typeof createMcpServer>
	user: McpUser
}

/**
 * Returns a request handler that processes MCP protocol routes.
 * Returns `true` if the request was handled, `false` if it should be
 * forwarded to another handler (e.g. SvelteKit).
 */
export function createMcpRequestHandler(): (
	req: http.IncomingMessage,
	res: http.ServerResponse
) => Promise<boolean> {
	const streamableSessions = new Map<string, SessionEntry>()
	const sseSessions = new Map<string, SseSessionEntry>()

	function sendJson(res: http.ServerResponse, status: number, data: unknown) {
		res.writeHead(status, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
			'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
			'Access-Control-Expose-Headers': 'Mcp-Session-Id',
		})
		res.end(JSON.stringify(data))
	}

	function setCorsHeaders(res: http.ServerResponse) {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
		res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id')
	}

	// --- Streamable HTTP ---

	async function handleStreamablePost(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const sessionId = req.headers['mcp-session-id'] as string | undefined

		if (sessionId && streamableSessions.has(sessionId)) {
			const session = streamableSessions.get(sessionId)!
			await session.transport.handleRequest(req, res)
			return
		}

		const user = await authenticateRequest(req)
		if (!user) {
			sendJson(res, 401, { error: 'API key invalide ou manquante' })
			return
		}

		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
		})

		const server = createMcpServer()

		transport.onclose = () => {
			const sid = transport.sessionId
			if (sid) {
				removeSession(sid)
				streamableSessions.delete(sid)
			}
		}

		await server.connect(transport)

		if (transport.sessionId) {
			setSessionUser(transport.sessionId, user)
			streamableSessions.set(transport.sessionId, { transport, server, user })
		}

		await transport.handleRequest(req, res)
	}

	async function handleStreamableGet(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const sessionId = req.headers['mcp-session-id'] as string | undefined
		if (!sessionId || !streamableSessions.has(sessionId)) {
			sendJson(res, 400, { error: 'Session ID invalide ou manquant' })
			return
		}
		const session = streamableSessions.get(sessionId)!
		await session.transport.handleRequest(req, res)
	}

	async function handleStreamableDelete(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const sessionId = req.headers['mcp-session-id'] as string | undefined
		if (!sessionId || !streamableSessions.has(sessionId)) {
			sendJson(res, 404, { error: 'Session non trouvée' })
			return
		}
		const session = streamableSessions.get(sessionId)!
		await session.transport.handleRequest(req, res)
		removeSession(sessionId)
		streamableSessions.delete(sessionId)
	}

	// --- SSE (legacy, Poke.com compatibility) ---

	async function handleSseConnect(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const user = await authenticateRequest(req)
		if (!user) {
			sendJson(res, 401, { error: 'API key invalide ou manquante' })
			return
		}

		setCorsHeaders(res)

		const transport = new SSEServerTransport('/messages', res)
		const server = createMcpServer()

		const sid = transport.sessionId
		setSessionUser(sid, user)
		sseSessions.set(sid, { transport, server, user })

		transport.onclose = () => {
			removeSession(sid)
			sseSessions.delete(sid)
		}

		await server.connect(transport)
	}

	async function handleSseMessage(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const url = new URL(req.url!, `http://${req.headers.host}`)
		const sessionId = url.searchParams.get('sessionId')

		if (!sessionId || !sseSessions.has(sessionId)) {
			sendJson(res, 404, { error: 'Session SSE non trouvée' })
			return
		}

		const session = sseSessions.get(sessionId)!
		await session.transport.handlePostMessage(req, res)
	}

	// --- Router ---

	return async (req, res) => {
		const url = new URL(req.url!, `http://${req.headers.host}`)
		const pathname = url.pathname

		if (req.method === 'OPTIONS' && ['/mcp', '/sse', '/messages', '/health'].includes(pathname)) {
			setCorsHeaders(res)
			res.writeHead(204)
			res.end()
			return true
		}

		try {
			if (pathname === '/mcp') {
				setCorsHeaders(res)
				switch (req.method) {
					case 'POST':
						await handleStreamablePost(req, res)
						break
					case 'GET':
						await handleStreamableGet(req, res)
						break
					case 'DELETE':
						await handleStreamableDelete(req, res)
						break
					default:
						sendJson(res, 405, { error: 'Method not allowed' })
				}
				return true
			}

			if (pathname === '/sse' && req.method === 'GET') {
				await handleSseConnect(req, res)
				return true
			}

			if (pathname === '/messages' && req.method === 'POST') {
				setCorsHeaders(res)
				await handleSseMessage(req, res)
				return true
			}

			if (pathname === '/health') {
				sendJson(res, 200, {
					status: 'ok',
					name: 'dotmeyia-mcp',
					version: '1.0.0',
					transports: ['streamable-http', 'sse'],
					activeSessions: {
						streamable: streamableSessions.size,
						sse: sseSessions.size,
					},
				})
				return true
			}
		} catch (err) {
			console.error('[MCP] Unhandled error:', err)
			if (!res.headersSent) {
				sendJson(res, 500, { error: 'Internal server error' })
			}
			return true
		}

		return false
	}
}
