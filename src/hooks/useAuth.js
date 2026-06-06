import { useState, useEffect } from 'react'
import { storageService } from '@/services/storageService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = storageService.getToken()
    const userData = storageService.getUser()
    
    if (token && userData) {
      setUser(userData)
      setIsAuthenticated(true)
    }
    
    setIsLoading(false)
  }, [])

  const login = (token, userData) => {
    storageService.setToken(token)
    storageService.setUser(userData)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    storageService.clear()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
