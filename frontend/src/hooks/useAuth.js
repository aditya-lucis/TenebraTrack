import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

export function useAuth() {
  const { user, setAuth, clearAuth, isLoggedIn } = useAuthStore()

  async function login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password })
    setAuth(data.user, data.tokens)
    return data.user
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register/', payload)
    setAuth(data.user, data.tokens)
    return data.user
  }

  async function logout() {
    const raw = localStorage.getItem('tenebra-auth')
    if (raw) {
      const { state } = JSON.parse(raw)
      try {
        await api.post('/auth/logout/', { refresh: state.refreshToken })
      } catch {}
    }
    clearAuth()
    window.location.href = '/login'
  }

  return { user, login, register, logout, isLoggedIn }
}