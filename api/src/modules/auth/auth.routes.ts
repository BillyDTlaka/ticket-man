import { FastifyPluginAsync } from 'fastify'
import { AuthService } from './auth.service'
import { loginSchema } from './auth.schema'
import { authenticate } from '../../shared/middleware/authenticate'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new AuthService(fastify.prisma)

  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body)
    const user = await service.login(email, password)
    const token = fastify.jwt.sign({ id: user.id, role: user.role, branchId: user.branchId })
    return reply.send({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, branch: user.branch } })
  })

  fastify.get('/me', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.user as any
    return service.me(id)
  })
}

export default authRoutes
