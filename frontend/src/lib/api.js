import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Inject access token
api.interceptors.request.use(config => {
  // Ambil langsung dari localStorage (avoid circular import dengan store)
  const raw = localStorage.getItem('tenebra-auth')
  if (raw) {
    const { state } = JSON.parse(raw)
    if (state?.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`
    }
  }
  return config
})

// Auto refresh saat 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const raw = localStorage.getItem('tenebra-auth')
        if (!raw) throw new Error('no token')

        const { state } = JSON.parse(raw)
        const { data }  = await axios.post('/api/auth/token/refresh/', {
          refresh: state.refreshToken,
        })

        // Update store
        const stored = JSON.parse(localStorage.getItem('tenebra-auth'))
        stored.state.accessToken = data.access
        localStorage.setItem('tenebra-auth', JSON.stringify(stored))

        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.removeItem('tenebra-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api