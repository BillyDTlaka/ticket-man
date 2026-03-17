import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ticket_man_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
}

// Branches
export const branchesApi = {
  getAll: () => api.get('/branches').then(r => r.data),
  getById: (id: string) => api.get(`/branches/${id}`).then(r => r.data),
  create: (data: any) => api.post('/branches', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/branches/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/branches/${id}`).then(r => r.data),
}

// Services
export const servicesApi = {
  getAll: (branchId?: string) => api.get('/services', { params: { branchId } }).then(r => r.data),
  create: (data: any) => api.post('/services', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/services/${id}`).then(r => r.data),
}

// Counters
export const countersApi = {
  getAll: (branchId?: string) => api.get('/counters', { params: { branchId } }).then(r => r.data),
  create: (data: any) => api.post('/counters', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/counters/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/counters/${id}`).then(r => r.data),
  openSession: (counterId: string) => api.post('/counters/session/open', { counterId }).then(r => r.data),
  closeSession: () => api.post('/counters/session/close').then(r => r.data),
  getActiveSession: () => api.get('/counters/session/active').then(r => r.data),
}

// Users
export const usersApi = {
  getAll: (branchId?: string) => api.get('/users', { params: { branchId } }).then(r => r.data),
  create: (data: any) => api.post('/users', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data).then(r => r.data),
  resetPassword: (id: string, password: string) => api.post(`/users/${id}/reset-password`, { password }).then(r => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
}

// Tickets
export const ticketsApi = {
  getAll: (params?: any) => api.get('/tickets', { params }).then(r => r.data),
  issue: (branchId: string, serviceCategoryId: string) => api.post('/tickets/issue', { branchId, serviceCategoryId }).then(r => r.data),
  callNext: (counterId: string, serviceCategoryId: string) => api.post('/tickets/call-next', { counterId, serviceCategoryId }).then(r => r.data),
  recall: (id: string) => api.post(`/tickets/${id}/recall`).then(r => r.data),
  startService: (id: string) => api.post(`/tickets/${id}/start`).then(r => r.data),
  endService: (id: string) => api.post(`/tickets/${id}/end`).then(r => r.data),
  noShow: (id: string) => api.post(`/tickets/${id}/no-show`).then(r => r.data),
  transfer: (id: string, serviceCategoryId: string) => api.post(`/tickets/${id}/transfer`, { serviceCategoryId }).then(r => r.data),
  getQueueSnapshot: (branchId: string) => api.get('/tickets/queue-snapshot', { params: { branchId } }).then(r => r.data),
  getRecentlyCalled: (branchId: string, limit?: number) => api.get('/tickets/recently-called', { params: { branchId, limit } }).then(r => r.data),
}

// Reports
export const reportsApi = {
  getSummary: (branchId: string, from: string, to: string) => api.get('/reports/summary', { params: { branchId, from, to } }).then(r => r.data),
  exportCsv: (branchId: string, from: string, to: string) => api.get('/reports/export', { params: { branchId, from, to }, responseType: 'blob' }).then(r => r.data),
}

export default api
