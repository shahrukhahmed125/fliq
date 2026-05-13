import { Navigate, Outlet } from 'react-router-dom'
import { storageService } from '@/services/storageService'

export default function GuestRoute() {
  const isAuthenticated = storageService.isAuthenticated()

  return !isAuthenticated ? <Outlet /> : <Navigate to="/feed" replace />
}
