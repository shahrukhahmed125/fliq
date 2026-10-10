import { useState } from 'react'
import { Bell, Heart, MessageSquare, Repeat2, UserPlus, CheckCheck } from 'lucide-react'
import { getInitials } from '@/lib/helpers'

function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const filters = ['All', 'Mentions', 'Likes', 'Reposts', 'Follows']

  const [notificationList, setNotificationList] = useState([
    {
      id: 1,
      type: 'like',
      period: 'Today',
      users: [{ name: 'Ayesha Khan', username: '@ayeshawrites' }, { name: 'Omar Khan', username: '@omarkhan' }],
      count: 2,
      post: { content: 'Building in public from Pakistan needs better communities: founders, designers, and creators.' },
      time: '2m ago',
      read: false,
    },
    {
      id: 2,
      type: 'follow',
      period: 'Today',
      users: [{ name: 'Hassan Ali', username: '@hassanbuilds' }],
      count: 1,
      time: '15m ago',
      read: false,
    },
    {
      id: 3,
      type: 'mention',
      period: 'Today',
      users: [{ name: 'Zara Noor', username: '@zaracreates' }],
      count: 1,
      post: { content: '@fliq The new typography hierarchy and adaptive navigation look remarkable!' },
      time: '1h ago',
      read: false,
    },
    {
      id: 4,
      type: 'repost',
      period: 'Yesterday',
      users: [{ name: 'Bilal Ahmed', username: '@bilaldev' }],
      count: 1,
      post: { content: 'The future of software craft in Pakistan is moving towards calmer, high-signal products.' },
      time: '18h ago',
      read: true,
    },
    {
      id: 5,
      type: 'like',
      period: 'Yesterday',
      users: [{ name: 'Cricket Desk', username: '@cricketdesk' }, { name: 'Sarah Ahmed', username: '@sarahahmed' }, { name: 'Fatima Ali', username: '@fatimaali' }],
      count: 3,
      post: { content: 'Match room is live. Keep discussions thoughtful and sharp.' },
      time: '1d ago',
      read: true,
    },
  ])

  const handleMarkAllRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleMarkItemRead = (id) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={14} fill="var(--fliq-danger)" color="var(--fliq-danger)" />
      case 'mention':
        return <MessageSquare size={14} color="var(--fliq-accent)" />
      case 'repost':
        return <Repeat2 size={14} color="var(--fliq-accent)" />
      case 'follow':
        return <UserPlus size={14} color="var(--fliq-accent)" />
      default:
        return <Bell size={14} />
    }
  }

  const getNotificationTitle = (item) => {
    const primaryUser = item.users[0]?.name || 'Someone'
    if (item.count > 1) {
      const others = item.count - 1
      return `${primaryUser} and ${others} ${others === 1 ? 'other' : 'others'}`
    }
    return primaryUser
  }

  const getNotificationActionText = (item) => {
    switch (item.type) {
      case 'like':
        return item.count > 1 ? 'liked your post' : 'liked your post'
      case 'mention':
        return 'mentioned you in a conversation'
      case 'repost':
        return 'reposted your thought'
      case 'follow':
        return 'started following you'
      default:
        return 'interacted with your profile'
    }
  }

  const filtered = notificationList.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'mentions') return item.type === 'mention'
    if (filter === 'likes') return item.type === 'like'
    if (filter === 'reposts') return item.type === 'repost'
    if (filter === 'follows') return item.type === 'follow'
    return true
  })

  const unreadCount = notificationList.filter((n) => !n.read).length

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div className="header-content">
          <div>
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="notifications-unread-pill">{unreadCount} unread</span>
            )}
          </div>
          <button
            className="modal-close-button"
            type="button"
            aria-label="Mark all as read"
            onClick={handleMarkAllRead}
            title="Mark all as read"
          >
            <CheckCheck size={18} />
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="notifications-filters" role="tablist">
        {filters.map((f) => (
          <button
            key={f}
            className={filter === f.toLowerCase() ? 'active' : ''}
            type="button"
            role="tab"
            onClick={() => setFilter(f.toLowerCase())}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="notifications-list">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${!item.read ? 'unread' : ''}`}
              onClick={() => handleMarkItemRead(item.id)}
            >
              <div className="notification-avatar">
                <div className="avatar">
                  {getInitials(item.users[0]?.name || 'User')}
                </div>
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(item.type)}
                </div>
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-user">
                    <strong>{getNotificationTitle(item)}</strong>
                    <span className="notification-action">{getNotificationActionText(item)}</span>
                  </div>
                  <span className="notification-time">{item.time}</span>
                </div>

                {item.post && (
                  <div className="notification-post">
                    <p>{item.post.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Bell size={36} />
            </div>
            <strong style={{ color: 'var(--fliq-ink)', fontSize: '15px' }}>No notifications here</strong>
            <p style={{ fontSize: '13px', color: 'var(--fliq-muted)' }}>
              When people like your notes, reply, or follow your account, you will see them here.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default NotificationsPage
