import { useEffect, useState } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { storageService } from '@/services/storageService'

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load auth on app start
  useEffect(() => {
    const storedUser = storageService.getUser()
    const storedToken = storageService.getToken()

    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }

    setLoading(false)
  }, [])

  // LOGIN (central function)
  const login = (userData, tokenData) => {
    storageService.setUser(userData)
    storageService.setToken(tokenData)

    setUser(userData)
    setToken(tokenData)
  }

  // LOGOUT (global)
  const logout = () => {
    storageService.clear()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}