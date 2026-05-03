import api from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login/', { email, password })
    localStorage.setItem('access_token',  data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  },

  async register(payload) {
    const { data } = await api.post('/auth/register/', payload)
    localStorage.setItem('access_token',  data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  },

  async logout() {
    const refresh = localStorage.getItem('refresh_token')
    try { await api.post('/auth/logout/', { refresh }) } catch {}
    localStorage.clear()
    window.location.href = '/login'
  },

  getUser() {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  },

  isLoggedIn() {
    return !!localStorage.getItem('access_token')
  }
}