import { FastifyPluginAsync } from 'fastify'
import { UsersService } from './users.service'
import { authenticate } from '../../shared/middleware/authenticate'
import { authorize } from '../../shared/middleware/authorize'

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new UsersService(fastify.prisma)

  fastify.get('/', { preHandler: [authenticate, authorize('ADMIN', 'SUPERVISOR')] }, async (request) => {
    const { branchId } = request.query as any
    return service.findAll(branchId)
  })

  fastify.post('/', { preHandler: [authenticate, authorize('ADMIN')] }, async (request, reply) => {
    const user = await service.create(request.body as any)
    return reply.code(201).send(user)
  })

  fastify.put('/:id', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    return service.update(id, request.body as any)
  })

  fastify.post('/:id/reset-password', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    const { password } = request.body as any
    return service.resetPassword(id, password)
  })

  fastify.delete('/:id', { preHandler: [authenticate, authorize('ADMIN')] }, async (request) => {
    const { id } = request.params as any
    await service.delete(id)
    return { success: true }
  })
}

export default usersRoutes
