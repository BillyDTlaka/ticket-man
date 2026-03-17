import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../shared/errors'

export class CountersService {
  constructor(private prisma: PrismaClient) {}

  async findAll(branchId?: string) {
    return this.prisma.counter.findMany({
      where: branchId ? { branchId } : undefined,
      include: { services: { include: { serviceCategory: true } }, sessions: { where: { endedAt: null }, include: { user: { omit: { passwordHash: true } } } } },
      orderBy: { name: 'asc' },
    })
  }

  async create(data: { branchId: string; name: string; code: string }) {
    return this.prisma.counter.create({ data })
  }

  async assignService(counterId: string, serviceCategoryId: string) {
    return this.prisma.counterService.upsert({
      where: { counterId_serviceCategoryId: { counterId, serviceCategoryId } },
      update: {},
      create: { counterId, serviceCategoryId },
    })
  }

  async removeService(counterId: string, serviceCategoryId: string) {
    return this.prisma.counterService.delete({
      where: { counterId_serviceCategoryId: { counterId, serviceCategoryId } },
    })
  }

  async update(id: string, data: any) {
    return this.prisma.counter.update({ where: { id }, data })
  }

  async delete(id: string) {
    return this.prisma.counter.delete({ where: { id } })
  }

  async openSession(userId: string, counterId: string) {
    await this.prisma.agentSession.updateMany({ where: { userId, endedAt: null }, data: { endedAt: new Date() } })
    return this.prisma.agentSession.create({ data: { userId, counterId } })
  }

  async closeSession(userId: string) {
    return this.prisma.agentSession.updateMany({ where: { userId, endedAt: null }, data: { endedAt: new Date() } })
  }

  async getActiveSession(userId: string) {
    return this.prisma.agentSession.findFirst({ where: { userId, endedAt: null }, include: { counter: true } })
  }
}
