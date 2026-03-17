import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../shared/errors'

export class ServicesService {
  constructor(private prisma: PrismaClient) {}

  async findAll(branchId?: string) {
    return this.prisma.serviceCategory.findMany({
      where: branchId ? { branchId } : undefined,
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string) {
    const svc = await this.prisma.serviceCategory.findUnique({ where: { id } })
    if (!svc) throw new NotFoundError('Service category')
    return svc
  }

  async create(data: { branchId: string; name: string; code: string; prefix: string; description?: string }) {
    return this.prisma.serviceCategory.create({ data })
  }

  async update(id: string, data: any) {
    return this.prisma.serviceCategory.update({ where: { id }, data })
  }

  async delete(id: string) {
    return this.prisma.serviceCategory.delete({ where: { id } })
  }
}
