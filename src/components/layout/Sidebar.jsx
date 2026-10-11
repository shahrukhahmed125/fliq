import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Moon, MoreHorizontal, PenLine, Settings, UserRound, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import BrandLockup from '@/components/brand/BrandLockup'
import { navItems } from '@/data/fliqData'
import Spinner from '@/components/ui/Spinner'
import { authService } from '@/services/authService'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'
import { getInitials, getMediaUrl } from '@/lib/helpers'
import PostComposerModal from '@/features/feed/components/PostComposerModal'

function Sidebar({ theme, onSignOut, isRailCompact = false, onToggleRail = null }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showComposerModal, setShowComposerModal] = useState(false)
  const profileMenuRef = useRef(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Make API call to logout
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear auth state (context + storage) and redirect
      logout()
      if (onSignOut) onSignOut()
      setIsLoggingOut(false)
      setIsProfileMenuOpen(false)
      navigate(ROUTES.SIGN_IN)
    }
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    setShowComposerModal(true)
  }

  return (
    <>
    <aside className={`sidebar ${isRailCompact ? 'rail-compact' : ''}`}>
      <div className="sidebar-top-bar">
        <BrandLockup theme={theme} />
        {onToggleRail && (
          <button
            type="button"
            className={`rail-toggle-btn ${isRailCompact ? 'is-compact' : ''}`}
            onClick={onToggleRail}
            aria-label={isRailCompact ? 'Expand navigation rail' : 'Collapse navigation rail'}
            aria-expanded={!isRailCompact}
            title={isRailCompact ? 'Expand navigation (Rail)' : 'Collapse navigation (Rail)'}
          >
            <span className="rail-toggle-icon-wrap">
              {isRailCompact ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </span>
          </button>
        )}
      </div>

      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map(([Icon, label]) => {
          const isActive =
            (label === 'Home' && location.pathname === ROUTES.HOME) ||
            (label === 'Explore' && location.pathname === ROUTES.EXPLORE) ||
            (label === 'Notifications' && location.pathname === ROUTES.NOTIFICATIONS) ||
            (label === 'Messages' && location.pathname === ROUTES.MESSAGES) ||
            (label === 'Bookmarks' && location.pathname === ROUTES.BOOKMARKS) ||
            (label === 'Profile' && location.pathname === ROUTES.PROFILE) ||
            (label === 'Settings' && (location.pathname === ROUTES.SETTINGS_ACCOUNT || location.pathname === ROUTES.SETTINGS_DISPLAY))

          const badgeCount = label === 'Notifications' ? 3 : label === 'Messages' ? 1 : 0

          return (
          <a
            className={isActive ? 'nav-link active' : 'nav-link'}
            href={`#${label.toLowerCase()}`}
            key={label}
            title={label}
            onClick={(event) => {
              event.preventDefault()
              if (label === 'Home') navigate(ROUTES.HOME)
              else if (label === 'Explore') navigate(ROUTES.EXPLORE)
              else if (label === 'Notifications') navigate(ROUTES.NOTIFICATIONS)
              else if (label === 'Messages') navigate(ROUTES.MESSAGES)
              else if (label === 'Bookmarks') navigate(ROUTES.BOOKMARKS)
              else if (label === 'Profile') navigate(ROUTES.PROFILE)
              else if (label === 'Settings') navigate(ROUTES.SETTINGS_ACCOUNT)
            }}
          >
            <div className="nav-icon-container">
              <Icon size={21} strokeWidth={1.7} />
              {badgeCount > 0 && <span className="nav-badge-dot" />}
            </div>
            <span className="nav-label">{label}</span>
          </a>
          )
        })}
      </nav>

      <button className="post-button" type="button" onClick={handleCreatePost} title="Create note">
        <PenLine size={19} />
        <span className="post-btn-text">Post</span>
      </button>
      <div className="sidebar-profile-wrap" ref={profileMenuRef}>
        {isProfileMenuOpen && (
          <div className="profile-menu" role="menu" aria-label="Account menu">
            <div className="profile-menu-header">
              <div className="avatar">
                {user?.profile_photo ? (
                  <img
                    src={getMediaUrl(user.profile_photo)}
                    alt="profile"
                    className="avatar-img"
                  />
                ) : (
                  <span className="avatar-fallback">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              <div>
              <div className="profile-info">
                <strong className="profile-name" title={user?.name}>
                  {user?.name || 'Unknown User'}
                </strong>

                <span className="profile-username" title={user?.username}>
                  {user?.username || '@user'}
                </span>
              </div>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate(ROUTES.PROFILE)
                setIsProfileMenuOpen(false)
              }}
            >
              <UserRound size={17} />
              View profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate(ROUTES.SETTINGS_ACCOUNT)
                setIsProfileMenuOpen(false)
              }}
            >
              <Settings size={17} />
              Account settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate(ROUTES.SETTINGS_DISPLAY)
                setIsProfileMenuOpen(false)
              }}
            >
              <Moon size={17} />
              Appearance
            </button>
            <button 
              className="danger-menu-item" 
              type="button" 
              role="menuitem"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Spinner size={16} color="accent" />
                  Logging out...
                </span>
              ) : (
                <>
                  <LogOut size={17} />
                  Log out
                </>
              )}
            </button>
          </div>
        )}
        <div className={isProfileMenuOpen ? 'sidebar-profile active' : 'sidebar-profile'}>
          <div className="avatar">
            {user?.profile_photo ? (
              <img
                src={getMediaUrl(user.profile_photo)}
                alt="profile"
                className="avatar-img"
              />
            ) : (
              <span className="avatar-fallback">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="profile-info">
            <strong className="profile-name">
              {user?.name || 'Unknown User'}
            </strong>

            <span className="profile-username">
              {user?.username || '@user'}
            </span>
          </div>
          <button
            className="profile-more-button"
            type="button"
            aria-label="Open account menu"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
        {location.pathname !== ROUTES.HOME && <span className="profile-current-dot" aria-hidden="true" />}
      </div>

    </aside>
    <PostComposerModal
      isOpen={showComposerModal}
      onClose={() => setShowComposerModal(false)}
    />
    </>
  )
}

export default Sidebar
