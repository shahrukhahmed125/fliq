import { Bell, Compass, Home, PenLine, Users } from 'lucide-react'
import FliqMark from '@/components/brand/FliqMark'
import Composer from '@/features/feed/components/Composer'
import PostCard from '@/features/feed/components/PostCard'
import { posts } from '@/data/fliqData'

function MobilePreview() {
  return (
    <section className="mobile-preview" aria-label="Mobile app preview">
      <div className="phone-frame">
        <header className="mobile-topbar">
          <FliqMark compact />
          <strong>Home</strong>
          <Bell size={19} />
        </header>
        <div className="mobile-tabs">
          <button className="active" type="button">For You</button>
          <button type="button">Pakistan</button>
          <button type="button">Trending</button>
        </div>
        <Composer compact />
        <div className="mobile-posts">
          {posts.slice(0, 2).map((post) => (
            <PostCard post={post} key={`mobile-${post.handle}`} />
          ))}
        </div>
        <nav className="bottom-nav" aria-label="Mobile navigation">
          <Home className="active" size={20} />
          <Compass size={20} />
          <PenLine size={22} />
          <Bell size={20} />
          <Users size={20} />
        </nav>
      </div>
      <div className="phone-frame profile-phone">
        <div className="profile-banner" />
        <section className="profile-card">
          <div className="profile-avatar">Z</div>
          <button className="primary-action" type="button">Follow</button>
          <h2>Zara Noor</h2>
          <span>@zaracreates</span>
          <p>Design notes, creator tools, Lahore coffee spots, and calm internet energy.</p>
          <div className="profile-stats">
            <strong>18.4K <span>followers</span></strong>
            <strong>420 <span>following</span></strong>
          </div>
        </section>
        <div className="profile-tabs">
          <button className="active" type="button">Posts</button>
          <button type="button">Replies</button>
          <button type="button">Media</button>
        </div>
        <PostCard post={posts[1]} />
      </div>
    </section>
  )
}

export default MobilePreview
