import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import ScreenLoader from '@/components/ui/ScreenLoader'

function GuestRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <ScreenLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return <Outlet />
}

export default GuestRoute

