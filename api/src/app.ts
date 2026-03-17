import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { config } from './config'
import prismaPlugin from './shared/plugins/prisma'
import { AppError } from './shared/errors'

import authRoutes from './modules/auth/auth.routes'
import branchesRoutes from './modules/branches/branches.routes'
import servicesRoutes from './modules/services/services.routes'
import countersRoutes from './modules/counters/counters.routes'
import usersRoutes from './modules/users/users.routes'
import ticketsRoutes from './modules/tickets/tickets.routes'
import displayRoutes from './modules/display/display.routes'
import reportsRoutes from './modules/reports/reports.routes'

export async function buildApp() {
  const app = Fastify({
    logger: config.isDev ? { transport: { target: 'pino-pretty' } } : true,
  })

  await app.register(cors, { origin: true })
  await app.register(jwt, { secret: config.jwtSecret })
  await app.register(prismaPlugin)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.code || 'ERROR', message: error.message })
    }
    if (error.name === 'ZodError') {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', message: 'Invalid request data', issues: (error as any).errors })
    }
    app.log.error(error)
    return reply.code(500).send({ error: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' })
  })

  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(branchesRoutes, { prefix: '/branches' })
  await app.register(servicesRoutes, { prefix: '/services' })
  await app.register(countersRoutes, { prefix: '/counters' })
  await app.register(usersRoutes, { prefix: '/users' })
  await app.register(ticketsRoutes, { prefix: '/tickets' })
  await app.register(displayRoutes, { prefix: '/display' })
  await app.register(reportsRoutes, { prefix: '/reports' })

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}
