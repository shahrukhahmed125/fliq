import { Outlet, Navigate } from 'react-router-dom'
import { storageService } from '@/services/storageService'

function ProtectedRoute() {
  console.log('ProtectedRoute checking authentication...')
  const isAuthenticated = storageService.isAuthenticated()
  console.log('Is authenticated:', isAuthenticated)

  if (!isAuthenticated) {
    console.log('Redirecting to /signin')
    return <Navigate to="/signin" replace />
  }

  console.log('Rendering Outlet')
  return <Outlet />
}

export default ProtectedRoute
