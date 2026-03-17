import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NotFoundError } from '../../shared/errors'

export class UsersService {
  constructor(private prisma: PrismaClient) {}

  async findAll(branchId?: string) {
    return this.prisma.user.findMany({
      where: branchId ? { branchId } : undefined,
      omit: { passwordHash: true },
      include: { branch: true },
      orderBy: { firstName: 'asc' },
    })
  }

  async create(data: { email: string; password: string; firstName: string; lastName: string; role: UserRole; branchId?: string }) {
    const { password, ...rest } = data
    const passwordHash = await bcrypt.hash(password, 10)
    return this.prisma.user.create({ data: { ...rest, passwordHash }, omit: { passwordHash: true } })
  }

  async update(id: string, data: { firstName?: string; lastName?: string; role?: UserRole; branchId?: string; isActive?: boolean }) {
    return this.prisma.user.update({ where: { id }, data, omit: { passwordHash: true } })
  }

  async resetPassword(id: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10)
    await this.prisma.user.update({ where: { id }, data: { passwordHash } })
    return { success: true }
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }
}
