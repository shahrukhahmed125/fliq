import api from '@/api/axios'

const unwrapApiData = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'data') && payload.data !== undefined) {
    return payload.data
  }

  return payload
}

const normalizeAuthResponse = (response) => {
  const raw = response?.data ?? {}
  const token = raw?.token ?? raw?.data?.token ?? null

  let user = null
  if (raw?.data && typeof raw.data === 'object' && !raw.data.token && (raw.data.id || raw.data.email || raw.data.name)) {
    user = raw.data
  } else if (raw?.user && typeof raw.user === 'object') {
    user = raw.user
  } else if (raw?.data?.user && typeof raw.data.user === 'object') {
    user = raw.data.user
  } else if (raw?.data && typeof raw.data === 'object') {
    user = raw.data
  }

  return {
    ...raw,
    token,
    user,
    data: user || raw?.data || null,
  }
}

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials)
    return normalizeAuthResponse(response)
  },

  register: async (userData) => {
    const response = await api.post('/register', userData)
    return normalizeAuthResponse(response)
  },

  logout: async () => {
    try {
      const response = await api.get('/logout')
      return response.data
    } catch (_error) {
      try {
        const response = await api.post('/logout')
        return response.data
      } catch (_e) {
        return { status: 'success' }
      }
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email })
    return response.data
  },

  resetPassword: async (data) => {
    const response = await api.post('/reset-password', data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/user')
    return response.data
  },

  googleLogin: async (tokenResponse) => {
    const response = await api.post('/auth/google', {
      access_token: tokenResponse.access_token,
    })
    return normalizeAuthResponse(response)
  },
}
