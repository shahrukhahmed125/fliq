import { useState } from 'react'
import {
  AtSign,
  Bell,
  ChevronRight,
  KeyRound,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
  Moon,
  Check,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SettingsTopbar from '@/features/settings/components/SettingsTopbar'
import Tabs from '@/components/ui/Tabs'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'

function AccountSettingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Account')
  const [toastMessage, setToastMessage] = useState('')

  const [toggles, setToggles] = useState({
    directMessages: true,
    emailDigest: false,
    soundEffects: true,
    twoFactor: false,
    readReceipts: true,
  })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2200)
  }

  const handleToggle = (key, label) => {
    setToggles((prev) => {
      const nextVal = !prev[key]
      showToast(`${label} ${nextVal ? 'enabled' : 'disabled'}`)
      return { ...prev, [key]: nextVal }
    })
  }

  const tabs = ['Account', 'Security', 'Privacy', 'About']

  return (
    <main className="settings-page" id="account-settings">
      <SettingsTopbar
        eyebrow="Privacy, security, and preferences"
        onBack={() => navigate(ROUTES.HOME)}
        title="Settings"
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="settings-nav-tabs"
        ariaLabel="Settings category tabs"
      />

      <div className="settings-section-list">
        {activeTab === 'Account' && (
          <section className="settings-section">
            <h3>Identity & Appearance</h3>
            <button
              className="settings-row"
              type="button"
              onClick={() => navigate(ROUTES.PROFILE)}
            >
              <span className="settings-row-icon">
                <UserRound size={18} />
              </span>
              <span className="settings-row-copy">
                <strong>Profile information</strong>
                <small>{user?.name || 'User'} · {user?.username || '@user'}</small>
              </span>
              <ChevronRight size={18} />
            </button>

            <button
              className="settings-row"
              type="button"
              onClick={() => navigate(ROUTES.SETTINGS_DISPLAY)}
            >
              <span className="settings-row-icon">
                <Moon size={18} />
              </span>
              <span className="settings-row-copy">
                <strong>Display & Theme</strong>
                <small>Choose Light, Dark, or System mode.</small>
              </span>
              <ChevronRight size={18} />
            </button>

            <div className="settings-toggle-row">
              <span className="settings-row-icon">
                <Bell size={18} />
              </span>
              <div className="settings-row-copy">
                <strong>Email newsletter digest</strong>
                <small>Weekly curated conversations from Pakistan tech & culture.</small>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => handleToggle('emailDigest', 'Email digest')}
                aria-label="Toggle email digest"
              >
                {toggles.emailDigest ? (
                  <ToggleRight size={28} color="var(--fliq-accent)" />
                ) : (
                  <ToggleLeft size={28} color="var(--fliq-muted-light)" />
                )}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'Security' && (
          <section className="settings-section">
            <h3>Security & Login</h3>
            <div className="settings-toggle-row">
              <span className="settings-row-icon">
                <ShieldCheck size={18} />
              </span>
              <div className="settings-row-copy">
                <strong>Two-factor authentication</strong>
                <small>Require an authenticator code when signing into Fliq.</small>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => handleToggle('twoFactor', 'Two-factor authentication')}
                aria-label="Toggle 2FA"
              >
                {toggles.twoFactor ? (
                  <ToggleRight size={28} color="var(--fliq-accent)" />
                ) : (
                  <ToggleLeft size={28} color="var(--fliq-muted-light)" />
                )}
              </button>
            </div>

            <button className="settings-row" type="button" onClick={() => showToast('Password reset link sent to registered email')}>
              <span className="settings-row-icon">
                <KeyRound size={18} />
              </span>
              <span className="settings-row-copy">
                <strong>Change password</strong>
                <small>Update your login credentials.</small>
              </span>
              <ChevronRight size={18} />
            </button>

            <button className="settings-row" type="button" onClick={() => showToast('Currently active: 1 desktop session, 1 mobile session')}>
              <span className="settings-row-icon">
                <Smartphone size={18} />
              </span>
              <span className="settings-row-copy">
                <strong>Active devices</strong>
                <small>Chrome on macOS (Current session)</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </section>
        )}

        {activeTab === 'Privacy' && (
          <section className="settings-section">
            <h3>Direct Messaging & Interactions</h3>
            <div className="settings-toggle-row">
              <span className="settings-row-icon">
                <Mail size={18} />
              </span>
              <div className="settings-row-copy">
                <strong>Allow direct messages from anyone</strong>
                <small>If disabled, only accounts you follow can message you.</small>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => handleToggle('directMessages', 'Open Direct Messages')}
                aria-label="Toggle Direct Messages"
              >
                {toggles.directMessages ? (
                  <ToggleRight size={28} color="var(--fliq-accent)" />
                ) : (
                  <ToggleLeft size={28} color="var(--fliq-muted-light)" />
                )}
              </button>
            </div>

            <div className="settings-toggle-row">
              <span className="settings-row-icon">
                <AtSign size={18} />
              </span>
              <div className="settings-row-copy">
                <strong>Show read receipts in chat</strong>
                <small>Allow people to see when you have viewed their note.</small>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => handleToggle('readReceipts', 'Read receipts')}
                aria-label="Toggle read receipts"
              >
                {toggles.readReceipts ? (
                  <ToggleRight size={28} color="var(--fliq-accent)" />
                ) : (
                  <ToggleLeft size={28} color="var(--fliq-muted-light)" />
                )}
              </button>
            </div>
          </section>
        )}

        {activeTab === 'About' && (
          <section className="settings-section">
            <h3>Fliq Social Network</h3>
            <div className="settings-about-card">
              <div className="settings-about-header">
                <strong>Fliq v2.5.0 Production</strong>
                <span className="badge-build">Stable</span>
              </div>
              <p>
                A high-signal, calm public square for Pakistan and the world. Designed with zero-pill discipline, content-first typography, and real-time community channels.
              </p>
              <div className="settings-about-links">
                <button type="button" onClick={() => showToast('Community Guidelines: Be thoughtful, avoid outrage-baiting, debate ideas with respect.')}>
                  Community Guidelines
                </button>
                <span>·</span>
                <button type="button" onClick={() => showToast('Terms of Service: Respect creators and intellectual property.')}>
                  Terms of Service
                </button>
                <span>·</span>
                <button type="button" onClick={() => showToast('Privacy Policy: We never sell your data or profile telemetry.')}>
                  Privacy Policy
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Floating Micro-Toast Feedback */}
      {toastMessage && (
        <div className="fliq-toast">
          <Check size={16} color="var(--fliq-accent)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  )
}

export default AccountSettingsPage
