import { FastifyPluginAsync } from 'fastify'
import { ReportsService } from './reports.service'
import { authenticate } from '../../shared/middleware/authenticate'
import { authorize } from '../../shared/middleware/authorize'

const reportsRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ReportsService(fastify.prisma)

  fastify.get('/summary', { preHandler: [authenticate, authorize('ADMIN', 'SUPERVISOR')] }, async (request) => {
    const { branchId, from, to } = request.query as any
    return service.summary(branchId, from, to)
  })

  fastify.get('/export', { preHandler: [authenticate, authorize('ADMIN', 'SUPERVISOR')] }, async (request, reply) => {
    const { branchId, from, to } = request.query as any
    const csv = await service.exportCsv(branchId, from, to)
    reply.header('Content-Type', 'text/csv')
    reply.header('Content-Disposition', `attachment; filename="report-${from}-${to}.csv"`)
    return reply.send(csv)
  })
}

export default reportsRoutes
