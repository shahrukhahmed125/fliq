import { useEffect, useState } from 'react'
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
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [theme, setTheme] = useState('light')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Default to false to test auth
  const [authView, setAuthView] = useState('signin') // 'signin' or 'signup'

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      return
    }

    root.dataset.theme = theme
  }, [theme])

  const handleSignIn = () => {
    setIsAuthenticated(true)
    setActiveView('home')
  }

  const handleSignUp = () => {
    setIsAuthenticated(true)
    setActiveView('home')
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setAuthView('signin')
  }

  function renderMainView() {
    if (activeView === 'profile') {
      return <ProfilePage onBack={() => setActiveView('home')} />
    }

    if (activeView === 'account-settings') {
      return <AccountSettingsPage onBack={() => setActiveView('home')} />
    }

    if (activeView === 'display-mode') {
      return (
        <DisplayModePage
          onBack={() => setActiveView('home')}
          onThemeChange={setTheme}
          theme={theme}
        />
      )
    }

    return (
      <>
        <Feed />
        <ExploreStrip />
      </>
    )
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'signin') {
      return (
        <SignInPage 
          onSignIn={handleSignIn}
          onNavigateToSignUp={() => setAuthView('signup')}
          theme={theme}
        />
      )
    }
    
    if (authView === 'signup') {
      return (
        <SignUpPage 
          onSignUp={handleSignUp}
          onNavigateToSignIn={() => setAuthView('signin')}
          theme={theme}
        />
      )
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} theme={theme} onSignOut={handleSignOut} />
      <div className="main-column">
        {renderMainView()}
      </div>
      <RightPanel />
      <MobilePreview />
    </div>
  )
}

export default App
