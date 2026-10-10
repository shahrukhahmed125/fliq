import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin, ShieldCheck, Loader2, Edit3, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { profileHighlights } from '@/data/fliqData'
import PostCard from '@/features/feed/components/PostCard'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/useAuth'
import { getInitials, getRandomCover } from '@/lib/helpers'
import { useEffect, useState, useCallback } from 'react'
import { postService } from '@/services/postService'
import { storageService } from '@/services/storageService'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: 'Pakistan',
  })

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await postService.getPosts({
        user_id: user?.id,
      })
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('PROFILE POSTS ERROR:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user?.id) {
      fetchPosts()
      setEditFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: 'Pakistan',
      })
    }
  }, [user, fetchPosts])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updatedUser = {
      ...user,
      name: editFormData.name,
      bio: editFormData.bio,
    }
    const token = storageService.getToken() || 'active-token'
    login(updatedUser, token)
    setShowEditModal(false)
  }

  const tabs = ['Posts', 'Replies', 'Media', 'Likes']

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 0) return true
    if (activeTab === 1) return post.parent_id || post.isComment
    if (activeTab === 2) return post.media && post.media.length > 0
    if (activeTab === 3) return post.is_liked || (post.likes_count > 0)
    return true
  })

  const getEmptyMessage = () => {
    if (activeTab === 1) return 'No replies yet. Your conversation replies will appear here.'
    if (activeTab === 2) return 'No media yet. Photos and videos attached to your posts will appear here.'
    if (activeTab === 3) return 'No liked posts yet. Notes you like across Fliq will be collected here.'
    return 'No posts published yet.'
  }

  return (
    <main className="profile-page" id="profile">
      {/* Top Bar */}
      <header className="profile-topbar">
        <button
          className="back-button"
          type="button"
          aria-label="Back to home"
          onClick={() => navigate(ROUTES.HOME)}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1>{user?.name || 'Fliq Studio'}</h1>
          <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
        </div>
      </header>

      {/* Hero Header & Cover */}
      <section className="profile-hero">
        <div
          className="profile-cover"
          style={{
            backgroundImage: `url(${user?.profile_cover ? user.profile_cover : getRandomCover()})`,
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
              <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--fliq-accent)' }}>
                {getInitials(user?.name || 'Fliq Studio')}
              </span>
            )}
          </div>

          <div className="profile-actions">
            <button
              className="primary-action"
              type="button"
              onClick={() => setShowEditModal(true)}
              style={{ fontSize: '13px', padding: '7px 16px' }}
            >
              <Edit3 size={14} />
              <span>Edit profile</span>
            </button>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h2>{user?.name || 'Fliq Studio'}</h2>
              <span className="verified-badge" aria-label="Verified creator">
                <ShieldCheck size={16} />
              </span>
            </div>
            <div className="profile-handle">{user?.username || '@fliq'}</div>

            <p className="profile-bio">
              {user?.bio || 'Building a calmer public square for Pakistan. Product notes, community spaces, and thoughtful conversations.'}
            </p>

            <div className="profile-meta">
              <span><MapPin size={14} /> Pakistan</span>
              <span><LinkIcon size={14} /> fliq.pk</span>
              <span><CalendarDays size={14} /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}</span>
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

      {/* Profile Section Tabs */}
      <div className="profile-tabs-bar" role="tablist" aria-label="Profile navigation tabs">
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

      {/* Posts Stream */}
      <div className="post-list">
        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner" size={28} />
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard post={post} key={post.uuid || post.id} />
          ))
        ) : (
          <div className="empty-state">
            <p>{getEmptyMessage()}</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-container">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="modal-close-button"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--fliq-muted)' }}>Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                    style={{ padding: '10px 14px', borderRadius: 'var(--fliq-radius-md)', border: '1px solid var(--fliq-border)', background: 'var(--fliq-surface)', color: 'var(--fliq-ink)', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--fliq-muted)' }}>Bio</label>
                  <textarea
                    rows={3}
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    style={{ padding: '10px 14px', borderRadius: 'var(--fliq-radius-md)', border: '1px solid var(--fliq-border)', background: 'var(--fliq-surface)', color: 'var(--fliq-ink)', fontSize: '14px', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{ padding: '8px 16px', borderRadius: 'var(--fliq-radius-md)', fontSize: '13px', fontWeight: '600', color: 'var(--fliq-muted)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-action"
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProfilePage
