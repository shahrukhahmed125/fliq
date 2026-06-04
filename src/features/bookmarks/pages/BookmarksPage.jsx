import { useState } from 'react'
import { Bookmark, BookmarkCheck, MoreHorizontal, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '@/lib/helpers'
import { useAuth } from '@/context/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faRotate, faComment, faShare } from '@fortawesome/free-solid-svg-icons'
import { getMediaUrl, formatDate } from '@/lib/helpers'

function BookmarksPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for bookmarked posts
  const bookmarkedPosts = [
    {
      id: 1,
      uuid: '1',
      user: { name: 'Ayesha Khan', username: '@ayeshawrites', avatar: null },
      content: 'Building in public from Pakistan needs better communities: founders, designers, developers, creators, students. Fliq channels could become that daily space.',
      created_at: '2024-01-15T10:30:00Z',
      likes_count: 128,
      reposts_count: 45,
      replies_count: 23,
      media: [],
      is_liked: true,
      is_reposted: false
    },
    {
      id: 2,
      uuid: '2',
      user: { name: 'Hassan Ali', username: '@hassanbuilds', avatar: null },
      content: 'The startup ecosystem in Pakistan is growing rapidly. We need more incubators, better funding opportunities, and a supportive community.',
      created_at: '2024-01-14T15:45:00Z',
      likes_count: 256,
      reposts_count: 89,
      replies_count: 42,
      media: [],
      is_liked: false,
      is_reposted: true
    },
    {
      id: 3,
      uuid: '3',
      user: { name: 'Zara Noor', username: '@zaracreates', avatar: null },
      content: 'Design thinking is not just about aesthetics. It\'s about solving real problems for real people. The best designs are invisible.',
      created_at: '2024-01-13T09:20:00Z',
      likes_count: 312,
      reposts_count: 67,
      replies_count: 31,
      media: [],
      is_liked: true,
      is_reposted: false
    },
    {
      id: 4,
      uuid: '4',
      user: { name: 'Fliq Studio', username: '@fliq', avatar: null },
      content: 'Fliq is being shaped as a calmer public square for Pakistan: fast enough for live trends, thoughtful enough for creators, and simple enough to use every day.',
      created_at: '2024-01-12T14:00:00Z',
      likes_count: 520,
      reposts_count: 148,
      replies_count: 67,
      media: [],
      is_liked: true,
      is_reposted: true
    },
    {
      id: 5,
      uuid: '5',
      user: { name: 'Bilal Ahmed', username: '@bilaldev', avatar: null },
      content: 'Just shipped a new feature! 🚀 The team worked incredibly hard on this. Proud of what we\'ve built together.',
      created_at: '2024-01-11T11:30:00Z',
      likes_count: 189,
      reposts_count: 34,
      replies_count: 28,
      media: [],
      is_liked: false,
      is_reposted: false
    }
  ]

  const filteredPosts = bookmarkedPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePostClick = (postUuid) => {
    navigate(`/post/${postUuid}`)
  }

  const handleRemoveBookmark = (e, postId) => {
    e.stopPropagation()
    console.log('Remove bookmark:', postId)
  }

  return (
    <main className="bookmarks-page">
      <header className="bookmarks-header">
        <div className="header-content">
          <h1>Bookmarks</h1>
          <button className="icon-button" type="button" aria-label="Bookmark settings">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <p className="bookmarks-subtitle">
          {bookmarkedPosts.length} posts
        </p>
      </header>

      <div className="bookmarks-search">
        <label className="search-box">
          <Search size={18} />
          <input
            placeholder="Search bookmarks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="bookmarks-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bookmarked-post"
              onClick={() => handlePostClick(post.uuid)}
            >
              <div className="bookmark-header">
                <div className="avatar avatar-green">
                  {post.user.avatar ? (
                    <img src={post.user.avatar} alt={post.user.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-fallback">{getInitials(post.user.name)}</span>
                  )}
                </div>
                <div className="bookmark-user-info">
                  <strong>{post.user.name}</strong>
                  <span>{post.user.username} · {formatDate(post.created_at)}</span>
                </div>
                <button
                  className="bookmark-remove"
                  type="button"
                  aria-label="Remove bookmark"
                  onClick={(e) => handleRemoveBookmark(e, post.id)}
                >
                  <BookmarkCheck size={18} />
                </button>
              </div>

              <p className="bookmark-content">{post.content}</p>

              <div className="bookmark-actions">
                <button
                  type="button"
                  className={post.is_liked ? 'liked' : ''}
                  aria-label={post.is_liked ? 'Unlike' : 'Like'}
                >
                  <FontAwesomeIcon icon={faHeart} size="lg" style={{ color: post.is_liked ? '#ef4444' : 'inherit', opacity: post.is_liked ? 1 : 0.7 }} />
                  {post.likes_count > 0 && <span>{post.likes_count}</span>}
                </button>

                <button
                  type="button"
                  className={post.is_reposted ? 'reposted' : ''}
                  aria-label={post.is_reposted ? 'Undo repost' : 'Repost'}
                >
                  <FontAwesomeIcon icon={faRotate} size="lg" style={{ color: post.is_reposted ? '#10b981' : 'inherit', opacity: post.is_reposted ? 1 : 0.7 }} />
                  {post.reposts_count > 0 && <span>{post.reposts_count}</span>}
                </button>

                <button type="button" aria-label="Comment">
                  <FontAwesomeIcon icon={faComment} size="lg" style={{ opacity: 0.7 }} />
                  {post.replies_count > 0 && <span>{post.replies_count}</span>}
                </button>

                <button type="button" aria-label="Share">
                  <FontAwesomeIcon icon={faShare} size="lg" style={{ opacity: 0.7 }} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Bookmark size={48} />
            </div>
            <p>{searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}</p>
            {!searchQuery && (
              <p className="empty-subtitle">Save posts to see them here</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default BookmarksPage
