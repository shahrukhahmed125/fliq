import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import RightPanel from '@/components/layout/RightPanel'
import MobileNavigation from '@/components/layout/MobileNavigation'

function MainLayout({ theme, onSignOut }) {
  const [isRailCompact, setIsRailCompact] = useState(() => {
    try {
      return localStorage.getItem('fliq_rail_compact') === 'true'
    } catch {
      return false
    }
  })

  const handleToggleRail = () => {
    setIsRailCompact((prev) => {
      const next = !prev
      try {
        localStorage.setItem('fliq_rail_compact', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  return (
    <div className={`app-shell ${isRailCompact ? 'compact-rail' : ''}`}>
      <MobileNavigation />
      <Sidebar
        theme={theme}
        onSignOut={onSignOut}
        isRailCompact={isRailCompact}
        onToggleRail={handleToggleRail}
      />
      <div className="main-column">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  )
}

export default MainLayout
