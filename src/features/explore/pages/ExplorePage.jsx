import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  Code,
  Music,
  Camera,
  BookOpen,
  Gamepad2,
  Palette,
  Briefcase,
  Heart,
  X,
  MessageSquare,
  Users,
  TrendingUp,
} from 'lucide-react'
import { getInitials } from '@/lib/helpers'

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fliq_recent_searches') || '["#Cricket", "AI Revolution", "Coke Studio"]')
    } catch {
      return ["#Cricket", "AI Revolution", "Coke Studio"]
    }
  })
  const [followedUsers, setFollowedUsers] = useState(new Set([2]))
  const [joinedCommunities, setJoinedCommunities] = useState(new Set([1]))

  const tabs = ['Trending', 'Discussions', 'Communities', 'Creators', 'Categories']

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [searchParams])

  const handleSearchCommit = (query) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setSearchQuery(trimmed)
    setSearchParams({ q: trimmed })
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
      try {
        localStorage.setItem('fliq_recent_searches', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const removeRecentSearch = (e, item) => {
    e.stopPropagation()
    setRecentSearches((prev) => {
      const next = prev.filter((i) => i !== item)
      try {
        localStorage.setItem('fliq_recent_searches', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const trendingTopics = [
    {
      id: 1,
      category: 'Technology',
      name: 'AI Revolution',
      posts: '125.4K',
      meta: 'Trending in Pakistan',
      tag: '🔥 Surging',
    },
    {
      id: 2,
      category: 'Sports',
      name: 'Cricket World Cup',
      posts: '89.2K',
      meta: 'Sports · Live Match Room',
      tag: '⚡ 4.2k active',
    },
    {
      id: 3,
      category: 'Entertainment',
      name: 'Coke Studio Season',
      posts: '45.6K',
      meta: 'Music · Trending',
      tag: '🎶 Viral audio',
    },
    {
      id: 4,
      category: 'Business',
      name: 'Startup Ecosystem',
      posts: '32.1K',
      meta: 'Karachi & Lahore Tech',
      tag: '💼 Venture pulse',
    },
    {
      id: 5,
      category: 'Design',
      name: 'Calm Software Design',
      posts: '28.9K',
      meta: 'Community · Trending',
      tag: '✨ Hot topic',
    },
    {
      id: 6,
      category: 'Culture',
      name: 'Lahore Heritage Walk',
      posts: '18.4K',
      meta: 'Culture & Architecture',
      tag: '📸 Visual series',
    },
  ]

  const liveDiscussions = [
    {
      id: 101,
      title: 'Should Pakistan tech startups build global-first or solve regional infrastructure?',
      author: 'Ayesha Khan (@ayeshawrites)',
      participants: 142,
      replies: 86,
      category: 'Tech Debate',
      time: 'Live now',
    },
    {
      id: 102,
      title: 'Post-match tactical breakdown: Spin bowling strategies on subcontinental pitches',
      author: 'Cricket Desk (@cricketdesk)',
      participants: 310,
      replies: 194,
      category: 'Sports Room',
      time: 'Active 12m ago',
    },
    {
      id: 103,
      title: 'Typography & Micro-interactions: What makes social apps feel calm instead of addictive?',
      author: 'Designers PK (@designerspk)',
      participants: 98,
      replies: 54,
      category: 'UI/UX Community',
      time: 'Active 28m ago',
    },
  ]

  const communities = [
    {
      id: 1,
      name: 'Pakistan Tech Founders',
      handle: 'c/tech-pk',
      description: 'Founders, engineers, and operators building software products from Pakistan.',
      members: '18.4K members',
      activity: '34 posts today',
    },
    {
      id: 2,
      name: 'Cricket Analysis Circle',
      handle: 'c/cricket-analysis',
      description: 'Serious cricket discussion without rage-baiting or generic memes.',
      members: '42.1K members',
      activity: '120 posts today',
    },
    {
      id: 3,
      name: 'Product & Design Collective',
      handle: 'c/design-collective',
      description: 'Exploring clean design systems, typography, and human-centered software.',
      members: '12.8K members',
      activity: '19 posts today',
    },
    {
      id: 4,
      name: 'Film & Sound Trackers',
      handle: 'c/cinema-sound',
      description: 'Curating South Asian music, independent cinema, and audio experiments.',
      members: '9.6K members',
      activity: '14 posts today',
    },
  ]

  const suggestedUsers = [
    {
      id: 1,
      name: 'Sarah Ahmed',
      username: '@sarahahmed',
      bio: 'Design systems engineer & typography enthusiast. Building calm interfaces.',
      followers: '14.2K followers',
    },
    {
      id: 2,
      name: 'Omar Khan',
      username: '@omarkhan',
      bio: 'Building public infrastructure from Islamabad. Exploring generative compute.',
      followers: '28.9K followers',
    },
    {
      id: 3,
      name: 'Fatima Ali',
      username: '@fatimaali',
      bio: 'Documentary photographer & visual curator capturing northern landscapes.',
      followers: '19.4K followers',
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      username: '@ahmedhassan',
      bio: 'Open-source distributed systems and Python performance engineering.',
      followers: '8.7K followers',
    },
  ]

  const categories = [
    { id: 1, name: 'Technology', icon: Code, posts: '45.2K' },
    { id: 2, name: 'Music', icon: Music, posts: '32.8K' },
    { id: 3, name: 'Photography', icon: Camera, posts: '28.4K' },
    { id: 4, name: 'Literature', icon: BookOpen, posts: '18.6K' },
    { id: 5, name: 'Gaming', icon: Gamepad2, posts: '24.1K' },
    { id: 6, name: 'Design & Art', icon: Palette, posts: '15.9K' },
    { id: 7, name: 'Venture & Business', icon: Briefcase, posts: '21.3K' },
    { id: 8, name: 'Culture & Life', icon: Heart, posts: '19.7K' },
  ]

  const handleToggleFollow = (userId) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const handleToggleCommunity = (communityId) => {
    setJoinedCommunities((prev) => {
      const next = new Set(prev)
      if (next.has(communityId)) next.delete(communityId)
      else next.add(communityId)
      return next
    })
  }

  const filteredTrending = trendingTopics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = suggestedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="explore-page">
      {/* Live Discovery Pulse Banner */}
      <section className="explore-pulse-banner">
        <div className="pulse-indicator">
          <span className="pulse-dot" />
          <span className="pulse-label">LIVE PULSE</span>
        </div>
        <p className="pulse-text">
          2,840 creators and founders sharing perspectives across Pakistan right now
        </p>
        <div className="pulse-quick-chips">
          {['#Cricket', '#StartupsPK', '#KarachiTech', '#CokeStudio', '#LahoreDesign'].map((chip) => (
            <button
              type="button"
              key={chip}
              className="pulse-chip"
              onClick={() => handleSearchCommit(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* Header & Search Bar */}
      <header className="explore-header">
        <div className="search-box explore-search-box">
          <Search size={18} />
          <input
            placeholder="Search discussions, communities, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchCommit(searchQuery)
              }
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSearchParams({})
              }}
              style={{ color: 'var(--fliq-muted)', cursor: 'pointer' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Recent Searches Pills */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="recent-searches-bar">
          <span className="recent-label">Recent:</span>
          <div className="recent-chips">
            {recentSearches.map((item) => (
              <span
                key={item}
                className="recent-chip"
                onClick={() => handleSearchCommit(item)}
              >
                {item}
                <button
                  type="button"
                  className="recent-chip-remove"
                  onClick={(e) => removeRecentSearch(e, item)}
                  aria-label={`Remove ${item}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="explore-tabs" role="tablist" aria-label="Explore tabs">
        {tabs.map((tab, index) => (
          <button
            className={activeTab === index ? 'active' : ''}
            type="button"
            role="tab"
            key={tab}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="explore-content">
        {/* Tab 0: Trending */}
        {activeTab === 0 && (
          <div className="trending-section">
            <div className="trending-grid">
              {filteredTrending.length > 0 ? (
                filteredTrending.map((topic, idx) => (
                  <div
                    className="trending-card"
                    key={topic.id}
                    onClick={() => handleSearchCommit(topic.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="trending-info">
                      <div className="trending-badge-row">
                        <span className="trending-category">0{idx + 1} · {topic.category}</span>
                        <span className="trending-tag-pill">{topic.tag}</span>
                      </div>
                      <h2 className="trending-name">{topic.name}</h2>
                      <span className="trending-meta">{topic.meta}</span>
                    </div>
                    <div className="trending-posts">
                      <TrendingUp size={15} color="var(--fliq-accent)" />
                      <span>{topic.posts}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No trending conversations matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 1: Live Discussions */}
        {activeTab === 1 && (
          <div className="discussions-section">
            <div className="discussions-list">
              {liveDiscussions.map((d) => (
                <article
                  key={d.id}
                  className="discussion-card"
                  onClick={() => navigate('/feed')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="discussion-header">
                    <span className="discussion-category">{d.category}</span>
                    <span className="discussion-time">{d.time}</span>
                  </div>
                  <h3 className="discussion-title">{d.title}</h3>
                  <div className="discussion-footer">
                    <span className="discussion-author">{d.author}</span>
                    <div className="discussion-stats">
                      <span><Users size={13} /> {d.participants} joined</span>
                      <span><MessageSquare size={13} /> {d.replies} replies</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Communities */}
        {activeTab === 2 && (
          <div className="communities-section">
            <div className="communities-grid">
              {filteredCommunities.map((c) => {
                const isJoined = joinedCommunities.has(c.id)
                return (
                  <div key={c.id} className="community-card">
                    <div className="community-info">
                      <div className="community-badge-row">
                        <strong className="community-name">{c.name}</strong>
                        <span className="community-handle">{c.handle}</span>
                      </div>
                      <p className="community-desc">{c.description}</p>
                      <div className="community-meta">
                        <span>{c.members}</span>
                        <span>·</span>
                        <span>{c.activity}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`follow-toggle-btn ${isJoined ? 'following' : ''}`}
                      onClick={() => handleToggleCommunity(c.id)}
                    >
                      {isJoined ? 'Joined' : 'Join Community'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Creators */}
        {activeTab === 3 && (
          <div className="suggested-users">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isFollowing = followedUsers.has(user.id)
                return (
                  <div className="user-card" key={user.id}>
                    <div className="avatar">
                      {getInitials(user.name)}
                    </div>
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span>{user.username}</span>
                      <p style={{ fontSize: '13px', color: 'var(--fliq-muted)', marginTop: '3px' }}>{user.bio}</p>
                      <span style={{ fontSize: '11.5px', color: 'var(--fliq-muted-light)', marginTop: '4px', display: 'inline-block' }}>{user.followers}</span>
                    </div>
                    <button
                      className={`follow-button ${isFollowing ? 'following' : ''}`}
                      type="button"
                      onClick={() => handleToggleFollow(user.id)}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="empty-state">
                <p>No profiles found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Categories */}
        {activeTab === 4 && (
          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  className="category-card"
                  key={category.id}
                  onClick={() => {
                    handleSearchCommit(category.name)
                    setActiveTab(0)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="category-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <span className="category-posts">{category.posts}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default ExplorePage
