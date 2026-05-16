import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Moon, MoreHorizontal, PenLine, Settings, UserRound } from 'lucide-react'
import BrandLockup from '@/components/brand/BrandLockup'
import { navItems } from '@/data/fliqData'
import Spinner from '@/components/ui/Spinner'
import { authService } from '@/services/authService'
import { storageService } from '@/services/storageService'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'

function Sidebar({ theme, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const profileMenuRef = useRef(null)
  const { user } = useAuth()

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
      
      // Clear storage
      storageService.clear()
      
      // Call the parent onSignOut function
      onSignOut()
      navigate(ROUTES.SIGN_IN)
      
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear storage and sign out
      storageService.clear()
      onSignOut()
      navigate(ROUTES.SIGN_IN)
    } finally {
      setIsLoggingOut(false)
      setIsProfileMenuOpen(false)
    }
  }

  return (
    <aside className="sidebar">
      <BrandLockup theme={theme} />
      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map(([Icon, label]) => {
          const isActive =
            (label === 'Home' && location.pathname === ROUTES.HOME) ||
            (label === 'Settings' && location.pathname === ROUTES.SETTINGS_ACCOUNT)

          return (
          <a
            className={isActive ? 'nav-link active' : 'nav-link'}
            href={`#${label.toLowerCase()}`}
            key={label}
            onClick={(event) => {
              if (label === 'Home') {
                event.preventDefault()
                navigate(ROUTES.HOME)
              }

              if (label === 'Settings') {
                event.preventDefault()
                navigate(ROUTES.SETTINGS_ACCOUNT)
              }
            }}
          >
            <Icon size={21} strokeWidth={1.7} />
            <span>{label}</span>
          </a>
          )
        })}
      </nav>
      <button className="post-button" type="button">
        <PenLine size={19} />
        <span>Post</span>
      </button>
      <div className="sidebar-profile-wrap" ref={profileMenuRef}>
        {isProfileMenuOpen && (
          <div className="profile-menu" role="menu" aria-label="Account menu">
            <div className="profile-menu-header">
              <div className="avatar">
                {user?.profile_photo ? (
                  <img
                    src={user.profile_photo}
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
                src={user.profile_photo}
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
  )
}

export default Sidebar
