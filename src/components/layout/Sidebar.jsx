import { useEffect, useRef, useState } from 'react'
import { LogOut, Moon, MoreHorizontal, PenLine, Settings, UserRound } from 'lucide-react'
import BrandLockup from '../brand/BrandLockup'
import { navItems } from '../../data/fliqData'

function Sidebar({ activeView, onNavigate }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

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

  return (
    <aside className="sidebar">
      <BrandLockup />
      <nav className="nav-list" aria-label="Primary navigation">
        {navItems.map(([Icon, label]) => {
          const isActive =
            (label === 'Home' && activeView === 'home') ||
            (label === 'Settings' && activeView === 'account-settings')

          return (
          <a
            className={isActive ? 'nav-link active' : 'nav-link'}
            href={`#${label.toLowerCase()}`}
            key={label}
            onClick={(event) => {
              if (label === 'Home') {
                event.preventDefault()
                onNavigate('home')
              }

              if (label === 'Settings') {
                event.preventDefault()
                onNavigate('account-settings')
              }
            }}
          >
            <Icon size={21} strokeWidth={2.1} />
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
                onNavigate('profile')
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
                onNavigate('account-settings')
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
                onNavigate('display-mode')
                setIsProfileMenuOpen(false)
              }}
            >
              <Moon size={17} />
              Display mode
            </button>
            <button className="danger-menu-item" type="button" role="menuitem">
              <LogOut size={17} />
              Log out 
            </button>
          </div>
        )}
        <div className={isProfileMenuOpen ? 'sidebar-profile active' : 'sidebar-profile'}>
          <div className="avatar avatar-dark">FK</div>
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
        {activeView !== 'home' && <span className="profile-current-dot" aria-hidden="true" />}
      </div>
    </aside>
  )
}

export default Sidebar
