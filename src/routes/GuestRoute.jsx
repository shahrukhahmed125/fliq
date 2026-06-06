import { Outlet, Navigate } from 'react-router-dom'
import { storageService } from '@/services/storageService'

function GuestRoute() {
  console.log('GuestRoute checking authentication...')
  const isAuthenticated = storageService.isAuthenticated()
  console.log('Is authenticated:', isAuthenticated)

  if (isAuthenticated) {
    console.log('Redirecting to /feed')
    return <Navigate to="/feed" replace />
  }

  console.log('Rendering Outlet')
  return <Outlet />
}

export default GuestRoute
