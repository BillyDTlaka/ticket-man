import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const branch = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {},
    create: {
      name: 'Head Office',
      code: 'HQ',
      address: '123 Main Street, City',
    },
  })

  const services = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'ENQ' } },
      update: {},
      create: { branchId: branch.id, name: 'Enquiries', code: 'ENQ', prefix: 'A' },
    }),
    prisma.serviceCategory.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'ACC' } },
      update: {},
      create: { branchId: branch.id, name: 'Accounts', code: 'ACC', prefix: 'B' },
    }),
    prisma.serviceCategory.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'COL' } },
      update: {},
      create: { branchId: branch.id, name: 'Collections', code: 'COL', prefix: 'C' },
    }),
  ])

  const counters = await Promise.all([
    prisma.counter.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'C1' } },
      update: {},
      create: { branchId: branch.id, name: 'Counter 1', code: 'C1' },
    }),
    prisma.counter.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'C2' } },
      update: {},
      create: { branchId: branch.id, name: 'Counter 2', code: 'C2' },
    }),
    prisma.counter.upsert({
      where: { branchId_code: { branchId: branch.id, code: 'C3' } },
      update: {},
      create: { branchId: branch.id, name: 'Counter 3', code: 'C3' },
    }),
  ])

  for (const counter of counters) {
    for (const service of services) {
      await prisma.counterService.upsert({
        where: { counterId_serviceCategoryId: { counterId: counter.id, serviceCategoryId: service.id } },
        update: {},
        create: { counterId: counter.id, serviceCategoryId: service.id },
      })
    }
  }

  await prisma.displayScreen.upsert({
    where: { branchId: branch.id },
    update: {},
    create: { branchId: branch.id, title: 'Head Office Queue' },
  })

  const hash = (pw: string) => bcrypt.hashSync(pw, 10)

  await prisma.user.upsert({
    where: { email: 'admin@ticketman.com' },
    update: {},
    create: {
      email: 'admin@ticketman.com',
      passwordHash: hash('Admin@12345'),
      firstName: 'System',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      branchId: branch.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'supervisor@ticketman.com' },
    update: {},
    create: {
      email: 'supervisor@ticketman.com',
      passwordHash: hash('Super@12345'),
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.SUPERVISOR,
      branchId: branch.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'agent1@ticketman.com' },
    update: {},
    create: {
      email: 'agent1@ticketman.com',
      passwordHash: hash('Agent@12345'),
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.AGENT,
      branchId: branch.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'reception@ticketman.com' },
    update: {},
    create: {
      email: 'reception@ticketman.com',
      passwordHash: hash('Recep@12345'),
      firstName: 'Mary',
      lastName: 'Jones',
      role: UserRole.RECEPTION,
      branchId: branch.id,
    },
  })

  console.log('✅ Seeding complete!')
  console.log('')
  console.log('Login credentials:')
  console.log('  Admin:      admin@ticketman.com / Admin@12345')
  console.log('  Supervisor: supervisor@ticketman.com / Super@12345')
  console.log('  Agent:      agent1@ticketman.com / Agent@12345')
  console.log('  Reception:  reception@ticketman.com / Recep@12345')
}

main().catch(console.error).finally(() => prisma.$disconnect())
