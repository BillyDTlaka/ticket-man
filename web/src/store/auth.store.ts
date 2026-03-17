'use client'
import { create } from 'zustand'
import { AuthUser } from '@/types'
import { setToken, removeToken, getToken } from '@/lib/auth'
import { authApi } from '@/lib/api'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getToken(),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    const { token, user } = await authApi.login(email, password)
    setToken(token)
    set({ token, user, isLoading: false })
  },

  logout: () => {
    removeToken()
    set({ user: null, token: null })
    window.location.href = '/login'
  },

  loadUser: async () => {
    const token = getToken()
    if (!token) return
    try {
      const user = await authApi.me()
      set({ user, token })
    } catch {
      removeToken()
      set({ user: null, token: null })
    }
  },
}))
