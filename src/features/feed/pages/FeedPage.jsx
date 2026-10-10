import { Loader2, ArrowUp, RefreshCw, Feather } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Composer from '@/features/feed/components/Composer'
import PostCard from '@/features/feed/components/PostCard'
import { postService } from '@/services/postService'

function FeedPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPostsCount, setNewPostsCount] = useState(0)
  const [showNewPostsPill, setShowNewPostsPill] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastPostIds = useRef(new Set())
  const tabs = ['For You', 'Trending', 'Media', 'Discussions']

  const handlePostSuccess = (newPost) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev])
      lastPostIds.current.add(newPost.id)
    }
  }

  const fetchPosts = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true)
      const newPosts = await postService.getPosts()

      if (isPolling && newPosts.length > 0) {
        const currentPostIds = new Set(newPosts.map((p) => p.id))
        const newPostIds = [...currentPostIds].filter((id) => !lastPostIds.current.has(id))

        if (newPostIds.length > 0) {
          setNewPostsCount(newPostIds.length)
          setShowNewPostsPill(true)
        }
      } else {
        setPosts(newPosts)
        lastPostIds.current = new Set(newPosts.map((p) => p.id))
        setNewPostsCount(0)
        setShowNewPostsPill(false)
      }
    } catch (error) {
      console.error('FEED POSTS ERROR:', error)
    } finally {
      if (!isPolling) setLoading(false)
    }
  }

  const handleNewPostsClick = () => {
    setIsRefreshing(true)
    setShowNewPostsPill(false)
    fetchPosts()
      .then(() => {
        document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
      })
      .finally(() => {
        setIsRefreshing(false)
      })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts(true)
    }, 30000)

    return () => clearInterval(pollInterval)
  }, [])

  const displayedPosts = posts.filter((p) => {
    if (activeTab === 2) return p.media && p.media.length > 0
    if (activeTab === 3) return (p.replies_count || p.replies || 0) > 0 || (p.comments && p.comments.length > 0)
    return true
  }).sort((a, b) => {
    if (activeTab === 1) return (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0)
    return 0
  })

  return (
    <main className="feed" id="top">
      {/* Sticky Feed Topbar */}
      <header className="feed-header">
        <div>
          <h1>Home</h1>
        </div>
        <button
          className="modal-close-button"
          type="button"
          aria-label="Refresh feed"
          onClick={() => fetchPosts()}
          title="Refresh feed"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      {/* Editorial Navigation Tabs */}
      <div className="feed-tabs" role="tablist" aria-label="Feed filter tabs">
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

      {/* Live Community Pulse Indicator */}
      <div className="feed-pulse-ticker">
        <span className="pulse-dot" />
        <span className="ticker-text">
          <strong>Live Pulse:</strong> 2.4k voices active across Pakistan today
        </span>
      </div>

      {/* Main Composer */}
      <Composer onPostSuccess={handlePostSuccess} />

      {/* Realtime New Posts Pill */}
      {showNewPostsPill && (
        <button
          className="new-posts-pill"
          type="button"
          onClick={handleNewPostsClick}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="spinner" size={15} />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <ArrowUp size={15} />
              <span>{newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'}</span>
            </>
          )}
        </button>
      )}

      {/* Post List */}
      <div className="post-list">
        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" size={28} />
          </div>
        ) : displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <PostCard post={post} key={post.uuid || post.id} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Feather size={40} />
            </div>
            <strong style={{ color: 'var(--fliq-ink)', fontSize: '16px' }}>Your feed is quiet</strong>
            <p style={{ fontSize: '13.5px', maxWidth: '320px' }}>
              Publish your first note above to ignite the conversation on Fliq.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default FeedPage
