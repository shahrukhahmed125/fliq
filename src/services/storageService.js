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
