import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ScreenLoader from '@/components/ui/ScreenLoader'
import { ROUTES } from '@/lib/constants'

// Lazy load pages
const FeedPage = lazy(() => import('@/features/feed/pages/FeedPage'))
const PostDetailPage = lazy(() => import('@/features/feed/pages/PostDetailPage'))
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const AccountSettingsPage = lazy(() => import('@/features/settings/pages/AccountSettingsPage'))
const DisplayModePage = lazy(() => import('@/features/settings/pages/DisplayModePage'))
const MessagesPage = lazy(() => import('@/features/messages/pages/MessagesPage'))
const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'))
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'))
const BookmarksPage = lazy(() => import('@/features/bookmarks/pages/BookmarksPage'))
const SignInPage = lazy(() => import('@/features/auth/pages/SignInPage'))
const SignUpPage = lazy(() => import('@/features/auth/pages/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))

function AppRoutes({ theme, onSignOut, onThemeChange }) {
  console.log('AppRoutes rendering...')
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout theme={theme} onSignOut={onSignOut} />}>
            <Route path={ROUTES.HOME} element={<FeedPage />} />
            <Route path={ROUTES.POST_DETAIL} element={<PostDetailPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS_ACCOUNT} element={<AccountSettingsPage />} />
            <Route path={ROUTES.SETTINGS_DISPLAY} element={<DisplayModePage onThemeChange={onThemeChange} theme={theme} />} />
            <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
            <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.BOOKMARKS} element={<BookmarksPage />} />
          </Route>
        </Route>

        {/* Guest routes */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.SIGN_IN} element={<SignInPage theme={theme} />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUpPage theme={theme} />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage theme={theme} />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
