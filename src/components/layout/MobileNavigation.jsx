import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Bell, MessageSquare, User, Plus } from 'lucide-react'
import FliqMark from '@/components/brand/FliqMark'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'
import PostComposerModal from '@/features/feed/components/PostComposerModal'

function MobileNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showComposer, setShowComposer] = useState(false)

  const getPageTitle = () => {
    switch (location.pathname) {
      case ROUTES.HOME:
        return 'Feed'
      case ROUTES.EXPLORE:
        return 'Discover'
      case ROUTES.NOTIFICATIONS:
        return 'Notifications'
      case ROUTES.MESSAGES:
        return 'Messages'
      case ROUTES.BOOKMARKS:
        return 'Bookmarks'
      case ROUTES.PROFILE:
        return user?.name || 'Profile'
      case ROUTES.SETTINGS_ACCOUNT:
      case ROUTES.SETTINGS_DISPLAY:
        return 'Settings'
      default:
        return 'Fliq'
    }
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="mobile-topbar-real">
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '44px', minHeight: '44px', border: 'none', background: 'transparent' }}
          aria-label="Home"
        >
          <FliqMark compact />
        </button>
        <span className="mobile-title">{getPageTitle()}</span>
        <button
          type="button"
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          aria-label="Notifications"
          style={{ minWidth: '44px', minHeight: '44px', display: 'grid', placeItems: 'center', color: 'var(--fliq-ink)', border: 'none', background: 'transparent' }}
        >
          <Bell size={19} />
        </button>
      </header>

      {/* Mobile Bottom Navigation Dock */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`mobile-nav-item ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
          onClick={() => navigate(ROUTES.HOME)}
          aria-label="Home"
        >
          <Home size={21} />
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${location.pathname === ROUTES.EXPLORE ? 'active' : ''}`}
          onClick={() => navigate(ROUTES.EXPLORE)}
          aria-label="Explore"
        >
          <Compass size={21} />
        </button>

        <button
          type="button"
          className="mobile-nav-compose"
          onClick={() => setShowComposer(true)}
          aria-label="Create Post"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${location.pathname === ROUTES.MESSAGES ? 'active' : ''}`}
          onClick={() => navigate(ROUTES.MESSAGES)}
          aria-label="Messages"
        >
          <MessageSquare size={21} />
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${location.pathname === ROUTES.PROFILE ? 'active' : ''}`}
          onClick={() => navigate(ROUTES.PROFILE)}
          aria-label="Profile"
        >
          <User size={21} />
        </button>
      </nav>

      {/* Mobile Post Composer Modal */}
      <PostComposerModal
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onPostSuccess={() => {
          setShowComposer(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </>
  )
}

export default MobileNavigation
