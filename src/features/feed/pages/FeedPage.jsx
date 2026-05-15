import { Sparkles, Loader2, ArrowUp } from 'lucide-react'
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
  const tabs = ['For You', 'Trending']

  const fetchPosts = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true)
      const response = await postService.getPosts()
      const newPosts = response.data || []
      
      if (isPolling && newPosts.length > 0) {
        const currentPostIds = new Set(newPosts.map(p => p.id))
        const newPostIds = [...currentPostIds].filter(id => !lastPostIds.current.has(id))
        
        if (newPostIds.length > 0) {
          setNewPostsCount(newPostIds.length)
          setShowNewPostsPill(true)
        }
      } else {
        setPosts(newPosts)
        lastPostIds.current = new Set(newPosts.map(p => p.id))
        setNewPostsCount(0)
        setShowNewPostsPill(false)
      }
    } catch (error) {
      console.log('FEED POSTS ERROR:', error)
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
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(pollInterval)
  }, [])

  return (
    <main className="feed" id="top">
      <header className="feed-header">
        <div>
          <h1>Home</h1>
        </div>
        <button className="icon-button" type="button" aria-label="Feed settings">
          <Sparkles size={20} />
        </button>
      </header>
      <div className="feed-tabs" role="tablist" aria-label="Feed tabs">
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
      <Composer />
      {showNewPostsPill && (
        <button 
          className="new-posts-pill" 
          type="button" 
          onClick={handleNewPostsClick}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="spinner" size={16} />
              Loading...
            </>
          ) : (
            <>
              <ArrowUp size={16} />
              {newPostsCount} new post{newPostsCount !== 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
      <div className="post-list">
        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" size={32} />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))
        ) : (
          <div className="empty-posts">No posts yet</div>
        )}
      </div>
    </main>
  )
}

export default FeedPage
