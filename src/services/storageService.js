const DEMO_USER = {
  id: 1,
  name: 'Fliq Studio',
  username: '@fliq',
  email: 'admin@fliq.pk',
  profile_photo: '/brand/fliq-app-icon-light.png',
  profile_cover: '/cover/default-1.png',
  bio: 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.',
  created_at: '2024-01-01T00:00:00Z',
}

// Initialize demo session on first visit
if (typeof window !== 'undefined' && !localStorage.getItem('fliq_session_initialized')) {
  localStorage.setItem('fliq_session_initialized', 'true')
  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(DEMO_USER))
  }
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'demo-token-active')
  }
}

export const storageService = {
  getToken: () => localStorage.getItem('token'),
  
  setToken: (token) => localStorage.setItem('token', token),
  
  removeToken: () => localStorage.removeItem('token'),
  
  getUser: () => {
    try {
      const user = localStorage.getItem('user')

      if (!user || user === 'undefined' || user === 'null') {
        return null
      }

      return JSON.parse(user)
    } catch (error) {
      console.error('Invalid user in localStorage:', error)
      return null
    }
  },
  
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  
  removeUser: () => localStorage.removeItem('user'),
  
  clear: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  isAuthenticated: () => !!localStorage.getItem('token'),
}
