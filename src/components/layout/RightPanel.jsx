import { Search, ShieldCheck, Sparkles } from 'lucide-react'
import { creators, trends } from '../../data/fliqData'

function RightPanel() {
  return (
    <aside className="right-panel">
      <label className="search-box">
        <Search size={18} />
        <input placeholder="Search Fliq" />
      </label>
      <section className="panel-section">
        <div className="section-heading">
          <h2>Trending in Pakistan</h2>
          <Sparkles size={18} />
        </div>
        {trends.map(([title, meta]) => (
          <a className="trend-row" href="#trend" key={title}>
            <span>{title}</span>
            <small>{meta}</small>
          </a>
        ))}
      </section>
      <section className="panel-section">
        <div className="section-heading">
          <h2>Creators to follow</h2>
          <ShieldCheck size={18} />
        </div>
        {creators.map(([name, handle, niche]) => (
          <div className="creator-row" key={handle}>
            <div className="avatar avatar-small">{name.slice(0, 1)}</div>
            <div>
              <strong>{name}</strong>
              <small>{handle} - {niche}</small>
            </div>
            <button type="button">Follow</button>
          </div>
        ))}
      </section>
    </aside>
  )
}

export default RightPanel
