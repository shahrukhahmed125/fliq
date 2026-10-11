import { useState, useEffect } from 'react'
import { Check, Moon, Smartphone, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SettingsTopbar from '@/features/settings/components/SettingsTopbar'
import Checkbox from '@/components/ui/Checkbox'
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

  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      return localStorage.getItem('fliq_reduce_motion') === 'true'
    } catch {
      return false
    }
  })

  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('fliq_high_contrast') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.setAttribute('data-reduce-motion', 'true')
    } else {
      document.documentElement.removeAttribute('data-reduce-motion')
    }
  }, [reduceMotion])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true')
    } else {
      document.documentElement.removeAttribute('data-high-contrast')
    }
  }, [highContrast])

  const handleReduceMotionChange = (checked) => {
    setReduceMotion(checked)
    try {
      localStorage.setItem('fliq_reduce_motion', String(checked))
    } catch {
      // ignore
    }
  }

  const handleHighContrastChange = (checked) => {
    setHighContrast(checked)
    try {
      localStorage.setItem('fliq_high_contrast', String(checked))
    } catch {
      // ignore
    }
  }

  return (
    <main className="settings-page" id="display-mode">
      <SettingsTopbar
        eyebrow="Theme, contrast, and reading comfort"
        onBack={() => navigate(ROUTES.HOME)}
        title="Display mode"
      />

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

      <div className="settings-section-list">
        <section className="settings-section">
          <div className="settings-section-header">
            <h3>Theme</h3>
            <p className="settings-section-desc">Select your preferred color scheme across devices.</p>
          </div>
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
                  {isActive && <Check size={18} className="theme-check-icon" />}
                </button>
              )
            })}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h3>Reading comfort</h3>
            <p className="settings-section-desc">Accessibility options tailored for visual comfort and readability.</p>
          </div>
          <div className="settings-group-card">
            <div className="settings-checkbox-row">
              <Checkbox
                id="pref-reduce-motion"
                checked={reduceMotion}
                onChange={handleReduceMotionChange}
                label="Reduce motion"
                description="Use calmer transitions across feeds, tabs, and navigation."
              />
            </div>
            <div className="settings-checkbox-row">
              <Checkbox
                id="pref-high-contrast"
                checked={highContrast}
                onChange={handleHighContrastChange}
                label="High contrast text"
                description="Make muted labels and secondary text sharper and easier to read."
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default DisplayModePage
