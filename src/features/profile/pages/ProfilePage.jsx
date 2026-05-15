import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin, MoreHorizontal, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { profileHighlights, profilePosts } from '@/data/fliqData'
import PostCard from '@/features/feed/components/PostCard'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'
import { getInitials, getRandomCover } from '@/lib/helpers'


function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <main className="profile-page" id="profile">
      <header className="profile-topbar">
        <button className="back-button" type="button" aria-label="Back to home" onClick={() => navigate(ROUTES.HOME)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>{user?.name || 'Fliq Studio'}</h1>
          <span>42 posts</span>
        </div>
      </header>

      <section className="profile-hero">
        <div
          className="profile-cover"
          style={{
            backgroundImage: `url(${
              user?.profile_cover
                ? user.profile_cover
                : getRandomCover()
            })`
          }}
        />
        <div className="profile-main">
          <div className="profile-main-avatar">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt="profile"
                className="avatar-img"
              />
            ) : (
              <span className="avatar-fallback">{getInitials(user?.name || 'Fliq Studio')}</span>
            )}
          </div>
          <div className="profile-actions">
            <button className="profile-action-button" type="button" aria-label="More profile actions">
              <MoreHorizontal size={19} />
            </button>
            <button className="primary-action" type="button">Edit profile</button>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h2>{user?.name || 'Fliq Studio'}</h2>
              <span className="verified-badge" aria-label="Verified profile">
                <ShieldCheck size={14} />
              </span>
            </div>
            <div className="profile-handle">{user?.username || '@fliq'}</div>
            <p className="profile-bio">
              {user?.bio || 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.'}
            </p>
            <div className="profile-meta">
              <span><MapPin size={15} /> Pakistan</span>
              <span><LinkIcon size={15} /> fliq.pk</span>
              <span><CalendarDays size={15} /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026'}</span>
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
