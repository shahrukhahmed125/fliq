import { Check, Moon, Smartphone, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SettingsTopbar from '@/features/settings/components/SettingsTopbar'
import { ROUTES } from '@/lib/constants'

const themeOptions = [
  {
    description: 'Bright, open, and best for daytime reading.',
    icon: Sun,
    label: 'Light',
    value: 'light',
  },
  {
    description: 'Low-glare interface for late-night conversations.',
    icon: Moon,
    label: 'Dark',
    value: 'dark',
  },
  {
    description: 'Match your browser or device appearance.',
    icon: Smartphone,
    label: 'System',
    value: 'system',
  },
]

function DisplayModePage({ onThemeChange, theme }) {
  const navigate = useNavigate()
  return (
    <main className="settings-page" id="display-mode">ROUTES.HOME
      <SettingsTopbar eyebrow="Theme, contrast, and reading comfort" onBack={() => navigate('/feed')} title="Display mode" />

      <section className="display-hero">
        <div>
          <span className="eyebrow">Appearance</span>
          <h2>Choose how Fliq feels on your screen.</h2>
          <p>
            Keep the interface calm and readable whether you are checking trends
            in the morning or following live conversations at night.
          </p>
        </div>
        <div className="theme-preview" aria-hidden="true">
          <div className="theme-preview-card">
            <span />
            <strong>Fliq Studio</strong>
            <p>Dark mode keeps long feeds easier on the eyes.</p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h3>Theme</h3>
        <div className="theme-option-grid">
          {themeOptions.map(({ description, icon: Icon, label, value }) => {
            const isActive = theme === value

            return (
              <button
                className={isActive ? 'theme-option active' : 'theme-option'}
                type="button"
                onClick={() => onThemeChange(value)}
                key={value}
              >
                <span className="settings-row-icon">
                  <Icon size={19} />
                </span>
                <span className="settings-row-copy">
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                {isActive && <Check size={18} />}
              </button>
            )
          })}
        </div>
      </section>

      <section className="settings-section compact-settings">
        <h3>Reading comfort</h3>
        <label className="settings-toggle-row">
          <span>
            <strong>Reduce motion</strong>
            <small>Use calmer transitions across feeds and menus.</small>
          </span>
          <input type="checkbox" />
        </label>
        <label className="settings-toggle-row">
          <span>
            <strong>High contrast text</strong>
            <small>Make muted labels and secondary text easier to read.</small>
          </span>
          <input type="checkbox" />
        </label>
      </section>
    </main>
  )
}

export default DisplayModePage
