import { useState } from 'react'
import { Search, TrendingUp, Users, Hash, Flame, Code, Music, Camera, BookOpen, Gamepad2, Palette, Briefcase, Heart } from 'lucide-react'
import { getInitials } from '@/lib/helpers'

function ExplorePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const tabs = ['Trending', 'Categories', 'People']

  // Mock data for trending topics
  const trendingTopics = [
    {
      id: 1,
      category: 'Technology',
      name: 'AI Revolution',
      posts: '125.4K',
      meta: 'Trending in Pakistan'
    },
    {
      id: 2,
      category: 'Sports',
      name: 'Cricket World Cup',
      posts: '89.2K',
      meta: 'Sports · Trending'
    },
    {
      id: 3,
      category: 'Entertainment',
      name: 'New Music Release',
      posts: '45.6K',
      meta: 'Music · Trending'
    },
    {
      id: 4,
      category: 'Business',
      name: 'Startup Ecosystem',
      posts: '32.1K',
      meta: 'Business · Trending'
    },
    {
      id: 5,
      category: 'Politics',
      name: 'Economic Policy',
      posts: '28.9K',
      meta: 'Politics · Trending'
    }
  ]

  // Mock data for categories
  const categories = [
    { id: 1, name: 'Technology', icon: Code, posts: '45.2K' },
    { id: 2, name: 'Music', icon: Music, posts: '32.8K' },
    { id: 3, name: 'Photography', icon: Camera, posts: '28.4K' },
    { id: 4, name: 'Books', icon: BookOpen, posts: '18.6K' },
    { id: 5, name: 'Gaming', icon: Gamepad2, posts: '24.1K' },
    { id: 6, name: 'Art', icon: Palette, posts: '15.9K' },
    { id: 7, name: 'Business', icon: Briefcase, posts: '21.3K' },
    { id: 8, name: 'Lifestyle', icon: Heart, posts: '19.7K' }
  ]

  // Mock data for suggested users
  const suggestedUsers = [
    {
      id: 1,
      name: 'Sarah Ahmed',
      username: '@sarahahmed',
      avatar: null,
      following: false
    },
    {
      id: 2,
      name: 'Omar Khan',
      username: '@omarkhan',
      avatar: null,
      following: true
    },
    {
      id: 3,
      name: 'Fatima Ali',
      username: '@fatimaali',
      avatar: null,
      following: false
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      username: '@ahmedhassan',
      avatar: null,
      following: false
    }
  ]

  const handleFollow = (userId) => {
    // In a real app, this would call an API
    console.log('Follow user:', userId)
  }

  const filteredTrending = trendingTopics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = suggestedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="explore-page">
      <header className="explore-header">
        <h1>Explore</h1>
      </header>

      <div className="explore-tabs" role="tablist" aria-label="Explore tabs">
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

      <div className="explore-content">
        {/* Search Bar */}
        <div className="search-bar" style={{ marginBottom: '24px' }}>
          <label className="search-box">
            <Search size={18} />
            <input
              placeholder="Search topics, people, or categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Trending Tab */}
        {activeTab === 0 && (
          <div className="trending-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="trending-grid">
              {filteredTrending.length > 0 ? (
                filteredTrending.map((topic) => (
                  <div className="trending-card" key={topic.id}>
                    <div className="trending-info">
                      <span className="trending-category">{topic.category}</span>
                      <h3 className="trending-name">{topic.name}</h3>
                      <span className="trending-meta">{topic.meta}</span>
                    </div>
                    <div className="trending-posts">
                      {topic.posts}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No trending topics found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 1 && (
          <div className="trending-section">
            <h2 className="section-title">Browse Categories</h2>
            <div className="categories-grid">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <div className="category-card" key={category.id}>
                    <div className="category-icon">
                      <Icon size={24} />
                    </div>
                    <h3 className="category-name">{category.name}</h3>
                    <span className="category-posts">{category.posts} posts</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* People Tab */}
        {activeTab === 2 && (
          <div className="trending-section">
            <h2 className="section-title">Suggested for You</h2>
            <div className="suggested-users">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div className="user-card" key={user.id}>
                    <div className="avatar avatar-green">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="avatar-img" />
                      ) : (
                        <span className="avatar-fallback">{getInitials(user.name)}</span>
                      )}
                    </div>
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span>{user.username}</span>
                    </div>
                    <button
                      className={`follow-button ${user.following ? 'following' : ''}`}
                      type="button"
                      onClick={() => handleFollow(user.id)}
                    >
                      {user.following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default ExplorePage
