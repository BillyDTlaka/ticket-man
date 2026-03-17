import { PrismaClient, TicketStatus } from '@prisma/client'
import { AppError, NotFoundError } from '../../shared/errors'

export class TicketsService {
  constructor(private prisma: PrismaClient) {}

  private async getNextTicketNumber(branchId: string, serviceCategoryId: string): Promise<string> {
    const service = await this.prisma.serviceCategory.findUnique({ where: { id: serviceCategoryId } })
    if (!service) throw new NotFoundError('Service category')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const count = await this.prisma.ticket.count({
      where: { branchId, serviceCategoryId, issuedAt: { gte: today } },
    })

    const num = String(count + 1).padStart(3, '0')
    return `${service.prefix}${num}`
  }

  async issue(data: { branchId: string; serviceCategoryId: string }) {
    const ticketNumber = await this.getNextTicketNumber(data.branchId, data.serviceCategoryId)
    const ticket = await this.prisma.ticket.create({
      data: { ...data, ticketNumber, status: TicketStatus.CREATED },
      include: { serviceCategory: true, branch: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId: ticket.id, status: TicketStatus.CREATED } })
    return ticket
  }

  async findAll(filters: { branchId?: string; serviceCategoryId?: string; status?: TicketStatus; date?: string }) {
    const where: any = {}
    if (filters.branchId) where.branchId = filters.branchId
    if (filters.serviceCategoryId) where.serviceCategoryId = filters.serviceCategoryId
    if (filters.status) where.status = filters.status
    if (filters.date) {
      const d = new Date(filters.date)
      d.setHours(0, 0, 0, 0)
      const e = new Date(d)
      e.setDate(e.getDate() + 1)
      where.issuedAt = { gte: d, lt: e }
    }
    return this.prisma.ticket.findMany({
      where,
      include: { serviceCategory: true, counter: true },
      orderBy: { issuedAt: 'asc' },
    })
  }

  async callNext(counterId: string, serviceCategoryId: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { serviceCategoryId, status: TicketStatus.CREATED },
      orderBy: { issuedAt: 'asc' },
    })
    if (!ticket) throw new AppError('No tickets waiting in this queue', 404, 'QUEUE_EMPTY')

    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: TicketStatus.CALLED, counterId, servedByUserId: userId, calledAt: new Date() },
      include: { serviceCategory: true, counter: true, branch: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId: ticket.id, status: TicketStatus.CALLED, userId } })
    return updated
  }

  async recall(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } })
    if (!ticket) throw new NotFoundError('Ticket')
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { calledAt: new Date() },
      include: { serviceCategory: true, counter: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId, status: TicketStatus.CALLED, userId, note: 'Recall' } })
    return updated
  }

  async startService(ticketId: string, userId: string) {
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.IN_SERVICE, startServiceAt: new Date() },
      include: { serviceCategory: true, counter: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId, status: TicketStatus.IN_SERVICE, userId } })
    return updated
  }

  async endService(ticketId: string, userId: string) {
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.SERVED, endServiceAt: new Date() },
      include: { serviceCategory: true, counter: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId, status: TicketStatus.SERVED, userId } })
    return updated
  }

  async noShow(ticketId: string, userId: string) {
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: TicketStatus.NO_SHOW },
      include: { serviceCategory: true, counter: true },
    })
    await this.prisma.ticketStatusLog.create({ data: { ticketId, status: TicketStatus.NO_SHOW, userId } })
    return updated
  }

  async transfer(ticketId: string, newServiceCategoryId: string, userId: string) {
    const service = await this.prisma.serviceCategory.findUnique({ where: { id: newServiceCategoryId } })
    if (!service) throw new NotFoundError('Service category')

    await this.prisma.ticket.update({ where: { id: ticketId }, data: { status: TicketStatus.TRANSFERRED } })
    await this.prisma.ticketStatusLog.create({ data: { ticketId, status: TicketStatus.TRANSFERRED, userId } })

    const original = await this.prisma.ticket.findUnique({ where: { id: ticketId } })
    if (!original) throw new NotFoundError('Ticket')

    return this.issue({ branchId: original.branchId, serviceCategoryId: newServiceCategoryId })
  }

  async getQueueSnapshot(branchId: string) {
    const services = await this.prisma.serviceCategory.findMany({ where: { branchId, isActive: true } })
    const snapshot = await Promise.all(
      services.map(async (svc) => {
        const waiting = await this.prisma.ticket.count({ where: { serviceCategoryId: svc.id, status: TicketStatus.CREATED } })
        const serving = await this.prisma.ticket.findMany({ where: { serviceCategoryId: svc.id, status: { in: [TicketStatus.CALLED, TicketStatus.IN_SERVICE] } }, include: { counter: true } })
        return { service: svc, waiting, serving }
      })
    )
    return snapshot
  }

  async getRecentlyCalled(branchId: string, limit = 10) {
    return this.prisma.ticket.findMany({
      where: { branchId, status: { in: [TicketStatus.CALLED, TicketStatus.IN_SERVICE] } },
      include: { serviceCategory: true, counter: true },
      orderBy: { calledAt: 'desc' },
      take: limit,
    })
  }
}
