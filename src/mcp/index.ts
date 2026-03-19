import 'dotenv/config'

import http from 'node:http'
import { createMcpRequestHandler } from './handler.js'

const PORT = parseInt(process.env.MCP_PORT ?? '3001', 10)

const mcpHandler = createMcpRequestHandler()

const server = http.createServer(async (req, res) => {
	const handled = await mcpHandler(req, res)
	if (!handled) {
		res.writeHead(404, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ error: 'Not found' }))
	}
})

server.listen(PORT, () => {
	console.log(`[dotMeyia MCP] Dev server running on http://localhost:${PORT}`)
	console.log(`  Streamable HTTP: http://localhost:${PORT}/mcp`)
	console.log(`  SSE (legacy):    http://localhost:${PORT}/sse`)
	console.log(`  Health check:    http://localhost:${PORT}/health`)
})
