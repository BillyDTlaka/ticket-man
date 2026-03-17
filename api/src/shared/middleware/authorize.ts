import { FastifyRequest, FastifyReply } from 'fastify'
import { UserRole } from '@prisma/client'
import { ForbiddenError } from '../errors'

export function authorize(...roles: UserRole[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const user = request.user as any
    if (!roles.includes(user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action')
    }
  }
}
