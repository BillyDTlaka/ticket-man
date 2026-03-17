import { FastifyPluginAsync } from 'fastify'
import { TicketsService } from './tickets.service'
import { authenticate } from '../../shared/middleware/authenticate'

const ticketsRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new TicketsService(fastify.prisma)

  fastify.get('/', { preHandler: [authenticate] }, async (request) => {
    return service.findAll(request.query as any)
  })

  fastify.post('/issue', { preHandler: [authenticate] }, async (request, reply) => {
    const { branchId, serviceCategoryId } = request.body as any
    const ticket = await service.issue({ branchId, serviceCategoryId })
    reply.code(201)
    return ticket
  })

  fastify.post('/call-next', { preHandler: [authenticate] }, async (request) => {
    const { counterId, serviceCategoryId } = request.body as any
    const { id: userId } = request.user as any
    const ticket = await service.callNext(counterId, serviceCategoryId, userId)
    fastify.sseClients?.forEach((client: any) => {
      if (client.branchId === ticket.branchId) {
        client.res.write(`data: ${JSON.stringify({ type: 'TICKET_CALLED', ticket })}\n\n`)
      }
    })
    return ticket
  })

  fastify.post('/:id/recall', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    const { id: userId } = request.user as any
    return service.recall(id, userId)
  })

  fastify.post('/:id/start', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    const { id: userId } = request.user as any
    return service.startService(id, userId)
  })

  fastify.post('/:id/end', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    const { id: userId } = request.user as any
    const ticket = await service.endService(id, userId)
    fastify.sseClients?.forEach((client: any) => {
      if (client.branchId === ticket.branchId) {
        client.res.write(`data: ${JSON.stringify({ type: 'TICKET_SERVED', ticket })}\n\n`)
      }
    })
    return ticket
  })

  fastify.post('/:id/no-show', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    const { id: userId } = request.user as any
    return service.noShow(id, userId)
  })

  fastify.post('/:id/transfer', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    const { id: userId } = request.user as any
    const { serviceCategoryId } = request.body as any
    return service.transfer(id, serviceCategoryId, userId)
  })

  fastify.get('/queue-snapshot', { preHandler: [authenticate] }, async (request) => {
    const { branchId } = request.query as any
    return service.getQueueSnapshot(branchId)
  })

  fastify.get('/recently-called', { preHandler: [authenticate] }, async (request) => {
    const { branchId, limit } = request.query as any
    return service.getRecentlyCalled(branchId, limit ? parseInt(limit) : 10)
  })
}

export default ticketsRoutes
