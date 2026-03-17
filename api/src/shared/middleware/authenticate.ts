import { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '../errors'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError()
  }
}
