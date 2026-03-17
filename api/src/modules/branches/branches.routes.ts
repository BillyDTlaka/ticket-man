import { FastifyPluginAsync } from 'fastify'
import { BranchesService } from './branches.service'
import { authenticate } from '../../shared/middleware/authenticate'
import { authorize } from '../../shared/middleware/authorize'

const branchesRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new BranchesService(fastify.prisma)

  fastify.get('/', { preHandler: [authenticate] }, async () => service.findAll())

  fastify.get('/:id', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params as any
    return service.findById(id)
  })

  fastify.post('/', { preHandler: [authenticate, authorize('ADMIN')] }, async (request, reply) => {
    const data = request.body as any
    const branch = await service.create(data)
    return reply.code(201).send(branch)
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

export default branchesRoutes
