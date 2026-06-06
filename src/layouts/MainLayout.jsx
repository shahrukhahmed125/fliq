import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import RightPanel from '@/components/layout/RightPanel'
import MobilePreview from '@/components/mobile/MobilePreview'

function MainLayout({ theme, onSignOut }) {
  return (
    <div className="app-shell">
      <Sidebar theme={theme} onSignOut={onSignOut} />
      <div className="main-column">
        <Outlet />
      </div>
      <RightPanel />
      <MobilePreview />
    </div>
  )
}

export default MainLayout
