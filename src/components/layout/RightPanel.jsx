import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Users } from 'lucide-react'
import { trends, creators } from '@/data/fliqData'
import { ROUTES } from '@/lib/constants'
import { getInitials } from '@/lib/helpers'

function RightPanel() {
  const navigate = useNavigate()
  const [searchVal, setSearchVal] = useState('')
  const [followedIds, setFollowedIds] = useState(new Set())

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`${ROUTES.EXPLORE}?q=${encodeURIComponent(searchVal.trim())}`)
    } else {
      navigate(ROUTES.EXPLORE)
    }
  }

  const handleToggleFollow = (handle) => {
    setFollowedIds((prev) => {
      const next = new Set(prev)
      if (next.has(handle)) {
        next.delete(handle)
      } else {
        next.add(handle)
      }
      return next
    })
  }

  const handleTrendClick = (trendName) => {
    navigate(`${ROUTES.EXPLORE}?q=${encodeURIComponent(trendName)}`)
  }

  return (
    <aside className="right-panel">
      {/* Quick Search */}
      <form onSubmit={handleSearchSubmit}>
        <label className="search-box">
          <Search size={16} />
          <input
            placeholder="Search discussions & people..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </label>
      </form>

      {/* Live Trends Card */}
      <section className="panel-card" aria-label="Trending Topics">
        <div className="panel-card-header">
          <h2>Trending in Pakistan</h2>
          <TrendingUp size={16} color="var(--fliq-accent)" />
        </div>
        <div className="trends-list">
          {trends.slice(0, 4).map(([title, meta], index) => (
            <div
              className="trend-item"
              key={title}
              onClick={() => handleTrendClick(title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="trend-info">
                <span className="trend-kicker">0{index + 1} · Trending</span>
                <span className="trend-title">{title}</span>
                <span className="trend-volume">{meta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Voices */}
      <section className="panel-card" aria-label="Suggested Voices">
        <div className="panel-card-header">
          <h2>Curated Voices</h2>
          <Users size={16} color="var(--fliq-muted)" />
        </div>
        <div className="suggested-creators-list">
          {creators.map(([name, handle, topic]) => {
            const isFollowing = followedIds.has(handle)
            return (
              <div className="suggested-creator-row" key={handle}>
                <div className="suggested-creator-info">
                  <div className="avatar avatar-small">
                    {getInitials(name)}
                  </div>
                  <div className="suggested-creator-text">
                    <strong>{name}</strong>
                    <span>{handle} · {topic}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`follow-toggle-btn ${isFollowing ? 'following' : ''}`}
                  onClick={() => handleToggleFollow(handle)}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Subtle Editorial Footer */}
      <footer className="panel-footer-links">
        <a href="#about" onClick={(e) => { e.preventDefault(); navigate(ROUTES.SETTINGS_ACCOUNT); }}>About</a>
        <span>·</span>
        <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
        <span>·</span>
        <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
        <span>·</span>
        <span>© 2026 Fliq Technologies</span>
      </footer>
    </aside>
  )
}

export default RightPanel
