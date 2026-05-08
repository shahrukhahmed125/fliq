import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin, MoreHorizontal, ShieldCheck } from 'lucide-react'
import { profileHighlights, profilePosts } from '../../data/fliqData'
import PostCard from '../feed/PostCard'

function ProfilePage({ onBack }) {
  return (
    <main className="profile-page" id="profile">
      <header className="profile-topbar">
        <button className="back-button" type="button" aria-label="Back to home" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Fliq Studio</h1>
          <span>42 posts</span>
        </div>
      </header>

      <section className="profile-hero">
        <div className="profile-cover" />
        <div className="profile-main">
          <div className="profile-main-avatar">FK</div>
          <div className="profile-actions">
            <button className="profile-action-button" type="button" aria-label="More profile actions">
              <MoreHorizontal size={19} />
            </button>
            <button className="primary-action" type="button">Edit profile</button>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h2>Fliq Studio</h2>
              <span className="verified-badge" aria-label="Verified profile">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div className="profile-handle">@fliq</div>
            <p className="profile-bio">
              Building a calmer public square for Pakistan. Product notes, community updates,
              creator tools, and design thinking for the next generation of social media.
            </p>
            <div className="profile-meta">
              <span><MapPin size={15} /> Pakistan</span>
              <span><LinkIcon size={15} /> fliq.pk</span>
              <span><CalendarDays size={15} /> Joined May 2026</span>
            </div>
            <div className="profile-stats-row">
              {profileHighlights.map(([value, label]) => (
                <div className="profile-stat" key={label}>
                  {value}<span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="profile-tabs-bar" role="tablist" aria-label="Profile tabs">
        {['Posts', 'Replies', 'Media', 'Likes'].map((tab, index) => (
          <button className={index === 0 ? 'active' : ''} type="button" role="tab" key={tab}>{tab}</button>
        ))}
      </div>

      <section className="profile-insight-grid" aria-label="Profile highlights">
        <div className="profile-insight">
          <strong>Creator-first updates</strong>
          <span>Early notes on product direction, moderation, and community spaces.</span>
        </div>
        <div className="profile-insight">
          <strong>Pakistan live trends</strong>
          <span>Tracking conversations around cricket, cities, creators, and tech.</span>
        </div>
      </section>

      <div className="post-list">
        {profilePosts.map((post) => (
          <PostCard post={post} key={post.handle} />
        ))}
      </div>
    </main>
  )
}

export default ProfilePage
