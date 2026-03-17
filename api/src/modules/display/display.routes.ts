import { FastifyPluginAsync } from 'fastify'
import { TicketsService } from '../tickets/tickets.service'

declare module 'fastify' {
  interface FastifyInstance {
    sseClients: Map<string, { res: any; branchId: string }>
  }
}

const displayRoutes: FastifyPluginAsync = async (fastify) => {
  if (!fastify.sseClients) {
    fastify.decorate('sseClients', new Map())
  }

  const ticketService = new TicketsService(fastify.prisma)

  fastify.get('/sse/:branchId', async (request, reply) => {
    const { branchId } = request.params as any

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    const clientId = `${branchId}-${Date.now()}`
    fastify.sseClients.set(clientId, { res: reply.raw, branchId })

    const snapshot = await ticketService.getRecentlyCalled(branchId)
    reply.raw.write(`data: ${JSON.stringify({ type: 'SNAPSHOT', tickets: snapshot })}\n\n`)

    const heartbeat = setInterval(() => {
      reply.raw.write(': heartbeat\n\n')
    }, 30000)

    request.raw.on('close', () => {
      clearInterval(heartbeat)
      fastify.sseClients.delete(clientId)
    })
  })

  fastify.get('/:branchId', async (request) => {
    const { branchId } = request.params as any
    const [recentlyCalled, snapshot, screen] = await Promise.all([
      ticketService.getRecentlyCalled(branchId, 8),
      ticketService.getQueueSnapshot(branchId),
      fastify.prisma.displayScreen.findUnique({ where: { branchId } }),
    ])
    return { recentlyCalled, snapshot, screen }
  })
}

export default displayRoutes
