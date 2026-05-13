import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ExploreStrip from './components/explore/ExploreStrip'
import Feed from './components/feed/Feed'
import RightPanel from './components/layout/RightPanel'
import Sidebar from './components/layout/Sidebar'
import MobilePreview from './components/mobile/MobilePreview'
import ProfilePage from './components/profile/ProfilePage'
import AccountSettingsPage from './components/settings/AccountSettingsPage'
import DisplayModePage from './components/settings/DisplayModePage'
import SignInPage from './components/auth/SignInPage'
import SignUpPage from './components/auth/SignUpPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import PublicRoute from './components/auth/PublicRoute'
import PrivateRoute from './components/auth/PrivateRoute'
import ScreenLoader from './components/ui/ScreenLoader'
import './App.css'

function AppContent() {
  const [theme, setTheme] = useState('light')
  const [isScreenLoading, setIsScreenLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      return
    }

    root.dataset.theme = theme
  }, [theme])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAuthRoute = ['/signin', '/signup', '/forgot-password'].includes(location.pathname)

  return (
    <>
      {isScreenLoading && <ScreenLoader message="Loading..." />}
      {!isAuthRoute && (
        <div className="app-shell">
          <Sidebar theme={theme} onSignOut={handleSignOut} />
          <div className="main-column">
            <Routes>
              <Route path="/feed" element={<><Feed /><ExploreStrip /></>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings/account" element={<AccountSettingsPage />} />
              <Route path="/settings/display" element={<DisplayModePage theme={theme} onThemeChange={setTheme} />} />
              <Route path="/" element={<Navigate to="/feed" replace />} />
            </Routes>
          </div>
          <RightPanel />
          <MobilePreview />
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<PublicRoute><SignInPage theme="light" /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUpPage theme="light" /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage theme="light" /></PublicRoute>} />
        <Route path="/*" element={<PrivateRoute><AppContent /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
