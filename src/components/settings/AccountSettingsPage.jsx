import {
  AtSign,
  Bell,
  ChevronRight,
  KeyRound,
  Languages,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SettingsTopbar from './SettingsTopbar'

const accountSections = [
  {
    title: 'Account',
    rows: [
      ['Profile information', 'Name, bio, username, and public identity.', UserRound],
      ['Username', '@fliq and profile link settings.', AtSign],
      ['Email and phone', 'Manage login recovery and phone verification.', Mail],
    ],
  },
  {
    title: 'Security',
    rows: [
      ['Password', 'Update password and account recovery options.', KeyRound],
      ['Two-step verification', 'Add extra protection for important accounts.', ShieldCheck],
      ['Devices', 'Review phones, browsers, and active sessions.', Smartphone],
    ],
  },
  {
    title: 'Preferences',
    rows: [
      ['Notifications', 'Likes, replies, follows, mentions, and trend alerts.', Bell],
      ['Language', 'English now, Urdu support planned for localization.', Languages],
    ],
  },
]

function AccountSettingsPage() {
  const navigate = useNavigate()
  return (
    <main className="settings-page" id="account-settings">
      <SettingsTopbar eyebrow="Privacy, login, and preferences" onBack={() => navigate('/feed')} title="Account settings" />

      <section className="settings-hero">
        <div className="settings-avatar avatar avatar-dark">FK</div>
        <div>
          <h2>Fliq Studio</h2>
          <span>@fliq</span>
          <p>Manage the core account details that shape your identity across Fliq.</p>
        </div>
        <button className="primary-action" type="button">Save changes</button>
      </section>

      <div className="settings-section-list">
        {accountSections.map((section) => (
          <section className="settings-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.rows.map(([title, description, Icon]) => (
              <button className="settings-row" type="button" key={title}>
                <span className="settings-row-icon">
                  <Icon size={18} />
                </span>
                <span className="settings-row-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}

export default AccountSettingsPage
