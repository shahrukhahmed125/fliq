import { ArrowLeft } from 'lucide-react'

function SettingsTopbar({ eyebrow, onBack, title }) {
  return (
    <header className="settings-topbar">
      <button className="back-button" type="button" aria-label="Back to home" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1>{title}</h1>
        <span>{eyebrow}</span>
      </div>
    </header>
  )
}

export default SettingsTopbar
