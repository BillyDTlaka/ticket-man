import { FastifyPluginAsync } from 'fastify'
import { CountersService } from './counters.service'
import { authenticate } from '../../shared/middleware/authenticate'
import { authorize } from '../../shared/middleware/authorize'

const countersRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new CountersService(fastify.prisma)

  fastify.get('/', { preHandler: [authenticate] }, async (request) => {
    const { branchId } = request.query as any
    return service.findAll(branchId)
  })

  fastify.post('/', { preHandler: [authenticate, authorize('ADMIN')] }, async (request, reply) => {
    const counter = await service.create(request.body as any)
    return reply.code(201).send(counter)
  })

  fastify.put('/:id', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    return service.update(id, request.body as any)
  })

  fastify.delete('/:id', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    await service.delete(id)
    return { success: true }
  })

  fastify.post('/:id/services', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    const { serviceCategoryId } = request.body as any
    return service.assignService(id, serviceCategoryId)
  })

  fastify.delete('/:id/services/:serviceId', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id, serviceId } = request.params as any
    return service.removeService(id, serviceId)
  })

  fastify.post('/session/open', { preHandler: [authenticate] }, async (request) => {
    const { id: userId } = request.user as any
    const { counterId } = request.body as any
    return service.openSession(userId, counterId)
  })

  fastify.post('/session/close', { preHandler: [authenticate] }, async (request) => {
    const { id: userId } = request.user as any
    return service.closeSession(userId)
  })

  fastify.get('/session/active', { preHandler: [authenticate] }, async (request) => {
    const { id: userId } = request.user as any
    return service.getActiveSession(userId)
  })
}

export default countersRoutes
