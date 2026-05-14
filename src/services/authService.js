import api from '@/api/axios'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/register', userData)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/logout')
    return response.data
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
      access_token: tokenResponse.access_token
    })

    return response.data
  },
}
