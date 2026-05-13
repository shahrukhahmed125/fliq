import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ScreenLoader from '@/components/ui/ScreenLoader'
import { ROUTES } from '@/lib/constants'

// Lazy load pages for better performance
const SignInPage = lazy(() => import('@/features/auth/pages/SignInPage'))
const SignUpPage = lazy(() => import('@/features/auth/pages/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const FeedPage = lazy(() => import('@/features/feed/pages/FeedPage'))
const ExploreStrip = lazy(() => import('@/features/feed/components/ExploreStrip'))
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const AccountSettingsPage = lazy(() => import('@/features/settings/pages/AccountSettingsPage'))
const DisplayModePage = lazy(() => import('@/features/settings/pages/DisplayModePage'))

function AppRoutes({ theme, onSignOut, onThemeChange }) {
  return (
    <Suspense fallback={<ScreenLoader message="Loading..." />}>
      <Routes>
        {/* Auth Routes - Guest Only */}
        <Route
          path={ROUTES.SIGN_IN}
          element={
            <GuestRoute>
              <AuthLayout>
                <SignInPage theme={theme} />
              </AuthLayout>
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.SIGN_UP}
          element={
            <GuestRoute>
              <AuthLayout>
                <SignUpPage theme={theme} />
              </AuthLayout>
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <GuestRoute>
              <AuthLayout>
                <ForgotPasswordPage theme={theme} />
              </AuthLayout>
            </GuestRoute>
          }
        />

        {/* Protected Routes - Auth Required */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout theme={theme} onSignOut={onSignOut}>
                <Routes>
                  <Route path={ROUTES.HOME} element={<><FeedPage /><ExploreStrip /></>} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTES.SETTINGS_ACCOUNT} element={<AccountSettingsPage />} />
                  <Route path={ROUTES.SETTINGS_DISPLAY} element={<DisplayModePage theme={theme} onThemeChange={onThemeChange} />} />
                  <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
