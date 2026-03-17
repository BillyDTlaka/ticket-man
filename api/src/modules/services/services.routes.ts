import { FastifyPluginAsync } from 'fastify'
import { ServicesService } from './services.service'
import { authenticate } from '../../shared/middleware/authenticate'
import { authorize } from '../../shared/middleware/authorize'

const servicesRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ServicesService(fastify.prisma)

  fastify.get('/', { preHandler: [authenticate] }, async (request) => {
    const { branchId } = request.query as any
    return service.findAll(branchId)
  })

  fastify.post('/', { preHandler: [authenticate, authorize('ADMIN')] }, async (request, reply) => {
    const svc = await service.create(request.body as any)
    return reply.code(201).send(svc)
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
}

export default servicesRoutes
