import { Search, Sparkles } from 'lucide-react'
import { trends } from '@/data/fliqData'

function RightPanel() {
  return (
    <aside className="right-panel">
      <label className="search-box">
        <Search size={18} />
        <input placeholder="Search" />
      </label>
      <section className="panel-section">
        <div className="section-heading">
          <h2>Trends</h2>
          <Sparkles size={18} />
        </div>
        {trends.map(([title, meta]) => (
          <a className="trend-row" href="#trend" key={title}>
            <span>{title}</span>
            <small>{meta}</small>
          </a>
        ))}
      </section>
    </aside>
  )
}

export default RightPanel
