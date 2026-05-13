import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Moon, MoreHorizontal, PenLine, Settings, UserRound } from 'lucide-react'
import BrandLockup from '../brand/BrandLockup'
import { navItems } from '../../data/fliqData'
import axios from 'axios'
import Spinner from '../ui/Spinner'

function Sidebar({ theme, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const profileMenuRef = useRef(null)
  const API_URL = 'http://127.0.0.1:8080/api/logout'

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
      
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      // Make API call to logout
      await axios.post(API_URL, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Call the parent onSignOut function
      onSignOut()
      navigate('/signin')
      
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear local storage and sign out
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      onSignOut()
      navigate('/signin')
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
            (label === 'Home' && location.pathname === '/feed') ||
            (label === 'Settings' && location.pathname === '/settings/account')

          return (
          <a
            className={isActive ? 'nav-link active' : 'nav-link'}
            href={`#${label.toLowerCase()}`}
            key={label}
            onClick={(event) => {
              if (label === 'Home') {
                event.preventDefault()
                navigate('/feed')
              }

              if (label === 'Settings') {
                event.preventDefault()
                navigate('/settings/account')
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
              <div className="avatar avatar-dark">FK</div>
              <div>
                <strong>Fliq Studio</strong>
                <span>@fliq</span>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                navigate('/profile')
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
                navigate('/settings/account')
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
                navigate('/settings/display')
                setIsProfileMenuOpen(false)
              }}
            >
              <Moon size={17} />
              Display mode
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
          <div className="avatar avatar-green">FK</div>
          <div>
            <strong>Fliq Studio</strong>
            <span>@fliq</span>
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
        {location.pathname !== '/feed' && <span className="profile-current-dot" aria-hidden="true" />}
      </div>
    </aside>
  )
}

export default Sidebar
