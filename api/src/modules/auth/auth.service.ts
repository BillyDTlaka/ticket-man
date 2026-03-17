import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AppError } from '../../shared/errors'

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, include: { branch: true } })
    if (!user || !user.isActive) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    return user
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { branch: true },
      omit: { passwordHash: true },
    })
  }
}
