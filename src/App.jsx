import { useEffect, useState } from 'react'
import ExploreStrip from './components/explore/ExploreStrip'
import Feed from './components/feed/Feed'
import RightPanel from './components/layout/RightPanel'
import Sidebar from './components/layout/Sidebar'
import MobilePreview from './components/mobile/MobilePreview'
import ProfilePage from './components/profile/ProfilePage'
import AccountSettingsPage from './components/settings/AccountSettingsPage'
import DisplayModePage from './components/settings/DisplayModePage'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('home')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      return
    }

    root.dataset.theme = theme
  }, [theme])

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

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} theme={theme} />
      <div className="main-column">
        {renderMainView()}
      </div>
      <RightPanel />
      <MobilePreview />
    </div>
  )
}

export default App
