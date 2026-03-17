import { PrismaClient, TicketStatus } from '@prisma/client'

export class ReportsService {
  constructor(private prisma: PrismaClient) {}

  private dateRange(from: string, to: string) {
    const start = new Date(from)
    start.setHours(0, 0, 0, 0)
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    return { gte: start, lte: end }
  }

  async summary(branchId: string, from: string, to: string) {
    const issuedAt = this.dateRange(from, to)

    const [total, served, noShow, byService] = await Promise.all([
      this.prisma.ticket.count({ where: { branchId, issuedAt } }),
      this.prisma.ticket.count({ where: { branchId, issuedAt, status: TicketStatus.SERVED } }),
      this.prisma.ticket.count({ where: { branchId, issuedAt, status: TicketStatus.NO_SHOW } }),
      this.prisma.serviceCategory.findMany({
        where: { branchId },
        include: {
          tickets: {
            where: { issuedAt },
            select: { status: true, issuedAt: true, startServiceAt: true, endServiceAt: true, calledAt: true },
          },
        },
      }),
    ])

    const servedTickets = await this.prisma.ticket.findMany({
      where: { branchId, issuedAt, status: TicketStatus.SERVED, startServiceAt: { not: null }, endServiceAt: { not: null } },
      select: { issuedAt: true, calledAt: true, startServiceAt: true, endServiceAt: true },
    })

    const avgWait = servedTickets.length
      ? servedTickets.reduce((sum, t) => {
          const wait = ((t.startServiceAt?.getTime() ?? 0) - t.issuedAt.getTime()) / 60000
          return sum + wait
        }, 0) / servedTickets.length
      : 0

    const avgService = servedTickets.length
      ? servedTickets.reduce((sum, t) => {
          const svc = ((t.endServiceAt?.getTime() ?? 0) - (t.startServiceAt?.getTime() ?? 0)) / 60000
          return sum + svc
        }, 0) / servedTickets.length
      : 0

    const serviceStats = byService.map((svc) => {
      const svcServed = svc.tickets.filter((t) => t.status === TicketStatus.SERVED)
      const svcAvgService = svcServed.length
        ? svcServed.reduce((sum, t) => sum + ((t.endServiceAt?.getTime() ?? 0) - (t.startServiceAt?.getTime() ?? 0)) / 60000, 0) / svcServed.length
        : 0
      return { service: svc.name, total: svc.tickets.length, served: svcServed.length, avgServiceMinutes: Math.round(svcAvgService * 10) / 10 }
    })

    const allTickets = await this.prisma.ticket.findMany({ where: { branchId, issuedAt }, select: { issuedAt: true } })
    const peakHours: Record<number, number> = {}
    allTickets.forEach((t) => { const h = t.issuedAt.getHours(); peakHours[h] = (peakHours[h] || 0) + 1 })

    return {
      total,
      served,
      noShow,
      avgWaitMinutes: Math.round(avgWait * 10) / 10,
      avgServiceMinutes: Math.round(avgService * 10) / 10,
      serviceStats,
      peakHours,
    }
  }

  async exportCsv(branchId: string, from: string, to: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { branchId, issuedAt: this.dateRange(from, to) },
      include: { serviceCategory: true, counter: true },
      orderBy: { issuedAt: 'asc' },
    })

    const rows = [
      ['Ticket#', 'Service', 'Counter', 'Status', 'Issued At', 'Called At', 'Start Service', 'End Service', 'Wait (min)', 'Service (min)'],
      ...tickets.map((t) => {
        const wait = t.startServiceAt ? Math.round(((t.startServiceAt.getTime() - t.issuedAt.getTime()) / 60000) * 10) / 10 : ''
        const svc = t.endServiceAt && t.startServiceAt ? Math.round(((t.endServiceAt.getTime() - t.startServiceAt.getTime()) / 60000) * 10) / 10 : ''
        return [t.ticketNumber, t.serviceCategory.name, t.counter?.name || '', t.status, t.issuedAt.toISOString(), t.calledAt?.toISOString() || '', t.startServiceAt?.toISOString() || '', t.endServiceAt?.toISOString() || '', wait, svc]
      }),
    ]

    return rows.map((r) => r.join(',')).join('\n')
  }
}
