import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import ScreenLoader from '@/components/ui/ScreenLoader'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <ScreenLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

