import { Sparkles, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Composer from '@/features/feed/components/Composer'
import PostCard from '@/features/feed/components/PostCard'
import { postService } from '@/services/postService'

function FeedPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const tabs = ['For You', 'Trending']

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await postService.getPosts()
        setPosts(response.data || [])
      } catch (error) {
        console.log('FEED POSTS ERROR:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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
      <button className="new-posts-pill" type="button">12 new posts</button>
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
