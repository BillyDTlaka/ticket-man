import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../../shared/errors'

export class BranchesService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.branch.findMany({ orderBy: { name: 'asc' } })
  }

  async findById(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id }, include: { serviceCategories: true, counters: true } })
    if (!branch) throw new NotFoundError('Branch')
    return branch
  }

  async create(data: { name: string; code: string; address?: string }) {
    return this.prisma.branch.create({ data })
  }

  async update(id: string, data: { name?: string; address?: string; isActive?: boolean }) {
    return this.prisma.branch.update({ where: { id }, data })
  }

  async delete(id: string) {
    return this.prisma.branch.delete({ where: { id } })
  }
}
