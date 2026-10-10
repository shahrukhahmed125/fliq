import { useState } from 'react'
import { BookmarkCheck, Search, X, MessageSquare, Repeat2, Heart, FolderHeart, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInitials, formatDate } from '@/lib/helpers'

const INITIAL_BOOKMARKS = [
  {
    id: 1,
    uuid: '1',
    category: 'Communities',
    user: { name: 'Ayesha Khan', username: '@ayeshawrites' },
    content: 'Building in public from Pakistan needs better communities: founders, designers, developers, creators, students. Fliq channels could become that daily space.',
    created_at: '2026-04-10T07:30:00.000Z',
    likes_count: 128,
    reposts_count: 45,
    replies_count: 23,
    is_liked: true,
    is_reposted: false,
  },
  {
    id: 2,
    uuid: '2',
    category: 'Venture & Tech',
    user: { name: 'Hassan Ali', username: '@hassanbuilds' },
    content: 'The startup ecosystem in Pakistan is growing rapidly. We need more incubators, better funding opportunities, and a supportive community.',
    created_at: '2026-04-09T14:15:00.000Z',
    likes_count: 256,
    reposts_count: 89,
    replies_count: 42,
    is_liked: false,
    is_reposted: true,
  },
  {
    id: 3,
    uuid: '3',
    category: 'Product Design',
    user: { name: 'Fliq Studio', username: '@fliq' },
    content: 'Fliq is being shaped as a calmer public square for Pakistan: fast enough for live trends, thoughtful enough for creators, and simple enough to use every day.',
    created_at: '2026-04-08T09:00:00.000Z',
    likes_count: 520,
    reposts_count: 148,
    replies_count: 67,
    is_liked: true,
    is_reposted: true,
  },
]

function BookmarksPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [bookmarkedPosts, setBookmarkedPosts] = useState(INITIAL_BOOKMARKS)
  const [toastMessage, setToastMessage] = useState('')

  const categories = ['All', 'Communities', 'Venture & Tech', 'Product Design']

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2200)
  }

  const filteredPosts = bookmarkedPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleRemoveBookmark = (e, postId) => {
    e.stopPropagation()
    setBookmarkedPosts((prev) => prev.filter((p) => p.id !== postId))
    showToast('Removed from Bookmarks')
  }

  return (
    <main className="bookmarks-page">
      <header className="bookmarks-header">
        <div className="header-content">
          <div>
            <h1>Saved Collections</h1>
            <p className="bookmarks-subtitle">
              {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'note' : 'notes'} in your private library
            </p>
          </div>
        </div>
      </header>

      {/* Search Input Bar */}
      <div className="bookmarks-search">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search your saved library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{ color: 'var(--fliq-muted)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bookmarks-category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      <div className="bookmarks-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bookmarked-post"
              onClick={() => navigate(`/post/${post.uuid}`)}
            >
              <div className="bookmark-header">
                <div className="avatar avatar-small">
                  {getInitials(post.user.name)}
                </div>
                <div className="bookmark-user-info">
                  <strong>{post.user.name}</strong>
                  <span style={{ color: 'var(--fliq-muted)', marginLeft: '6px' }}>
                    {post.user.username} · {formatDate(post.created_at)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="bookmark-category-badge">{post.category}</span>
                  <button
                    className="modal-close-button bookmark-remove"
                    type="button"
                    aria-label="Remove bookmark"
                    onClick={(e) => handleRemoveBookmark(e, post.id)}
                    title="Remove from saved"
                  >
                    <BookmarkCheck size={18} color="var(--fliq-accent)" />
                  </button>
                </div>
              </div>

              <p className="bookmark-content">{post.content}</p>

              <div className="bookmark-actions">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <MessageSquare size={14} /> {post.replies_count}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Repeat2 size={15} /> {post.reposts_count}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Heart size={14} fill={post.is_liked ? 'var(--fliq-danger)' : 'none'} color={post.is_liked ? 'var(--fliq-danger)' : 'currentColor'} /> {post.likes_count}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderHeart size={38} />
            </div>
            <strong style={{ color: 'var(--fliq-ink)', fontSize: '15px' }}>
              {searchQuery ? 'No bookmarks match your search' : 'Your saved collection is empty'}
            </strong>
            <p style={{ fontSize: '13px', color: 'var(--fliq-muted)', maxWidth: '280px' }}>
              Tap the bookmark icon on any post across Fliq to archive thoughtful discussions for later reading.
            </p>
          </div>
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

export default BookmarksPage
