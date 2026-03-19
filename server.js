import http from 'node:http'
import { handler } from './build/handler.js'
import { createMcpRequestHandler } from './dist-mcp/handler.js'

const PORT = parseInt(process.env.PORT ?? '3000', 10)
const HOST = process.env.HOST ?? '0.0.0.0'

const mcpHandler = createMcpRequestHandler()

const server = http.createServer(async (req, res) => {
	const handled = await mcpHandler(req, res)
	if (!handled) {
		handler(req, res)
	}
})

server.listen(PORT, HOST, () => {
	console.log(`[dotMeyia] Server running on http://${HOST}:${PORT}`)
	console.log(`  App:             http://${HOST}:${PORT}/`)
	console.log(`  MCP Streamable:  http://${HOST}:${PORT}/mcp`)
	console.log(`  MCP SSE:         http://${HOST}:${PORT}/sse`)
	console.log(`  Health check:    http://${HOST}:${PORT}/health`)
})
