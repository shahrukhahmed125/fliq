import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { posts } from '@/data/fliqData'
import Composer from '@/features/feed/components/Composer'
import PostCard from '@/features/feed/components/PostCard'

function FeedPage() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['For You', 'Trending']

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
        {posts.map((post) => (
          <PostCard post={post} key={post.handle} />
        ))}
      </div>
    </main>
  )
}

export default FeedPage
