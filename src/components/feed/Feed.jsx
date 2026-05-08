import { Sparkles } from 'lucide-react'
import { posts } from '../../data/fliqData'
import Composer from './Composer'
import PostCard from './PostCard'

function Feed() {
  return (
    <main className="feed" id="top">
      <header className="feed-header">
        <div>
          <h1>Home</h1>
          <span>Live public square</span>
        </div>
        <button className="icon-button" type="button" aria-label="Feed settings">
          <Sparkles size={20} />
        </button>
      </header>
      <div className="feed-tabs" role="tablist" aria-label="Feed tabs">
        {['For You', 'Following', 'Pakistan', 'Trending'].map((tab, index) => (
          <button className={index === 0 ? 'active' : ''} type="button" role="tab" key={tab}>{tab}</button>
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

export default Feed
