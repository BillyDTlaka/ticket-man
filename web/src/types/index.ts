export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'RECEPTION'

export type TicketStatus = 'CREATED' | 'CALLED' | 'IN_SERVICE' | 'SERVED' | 'NO_SHOW' | 'CANCELLED' | 'TRANSFERRED'

export interface Branch {
  id: string
  name: string
  code: string
  address?: string
  isActive: boolean
}

export interface ServiceCategory {
  id: string
  branchId: string
  name: string
  code: string
  prefix: string
  description?: string
  isActive: boolean
}

export interface Counter {
  id: string
  branchId: string
  name: string
  code: string
  isActive: boolean
  services?: { serviceCategory: ServiceCategory }[]
  sessions?: { user: User }[]
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  branchId?: string
  branch?: Branch
  isActive: boolean
}

export interface Ticket {
  id: string
  ticketNumber: string
  branchId: string
  serviceCategoryId: string
  counterId?: string
  status: TicketStatus
  issuedAt: string
  calledAt?: string
  startServiceAt?: string
  endServiceAt?: string
  serviceCategory: ServiceCategory
  counter?: Counter
  branch: Branch
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  branchId?: string
  branch?: Branch
}
