import { useState } from 'react'
import { Bell, MoreHorizontal, Heart, MessageSquare, RotateCw, UserPlus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getInitials } from '@/lib/helpers'
import { useAuth } from '@/context/useAuth'

function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const filters = ['All', 'Mentions', 'Likes', 'Follows']

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { name: 'Ayesha Khan', username: '@ayeshawrites', avatar: null },
      post: { content: 'Building in public from Pakistan needs better communities' },
      time: '2m',
      read: false
    },
    {
      id: 2,
      type: 'follow',
      user: { name: 'Hassan Ali', username: '@hassanbuilds', avatar: null },
      time: '15m',
      read: false
    },
    {
      id: 3,
      type: 'mention',
      user: { name: 'Zara Noor', username: '@zaracreates', avatar: null },
      post: { content: '@user Thanks for the great feedback on the design!' },
      time: '1h',
      read: false
    },
    {
      id: 4,
      type: 'repost',
      user: { name: 'Bilal Ahmed', username: '@bilaldev', avatar: null },
      post: { content: 'The future of tech in Pakistan is bright' },
      time: '3h',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: { name: 'Mina Tariq', username: '@minatalks', avatar: null },
      post: { content: 'Just shipped a new feature!' },
      time: '5h',
      read: true
    },
    {
      id: 6,
      type: 'follow',
      user: { name: 'Cricket Desk', username: '@cricketdesk', avatar: null },
      time: '1d',
      read: true
    },
    {
      id: 7,
      type: 'mention',
      user: { name: 'Fliq Studio', username: '@fliq', avatar: null },
      post: { content: '@user Welcome to Fliq! We\'re excited to have you here.' },
      time: '2d',
      read: true
    }
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={18} className="notification-icon like" />
      case 'mention':
        return <MessageSquare size={18} className="notification-icon mention" />
      case 'repost':
        return <RotateCw size={18} className="notification-icon repost" />
      case 'follow':
        return <UserPlus size={18} className="notification-icon follow" />
      default:
        return <Bell size={18} />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post'
      case 'mention':
        return 'mentioned you'
      case 'repost':
        return 'reposted your post'
      case 'follow':
        return 'started following you'
      default:
        return 'interacted with you'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'Mentions') return notification.type === 'mention'
    if (filter === 'Likes') return notification.type === 'like'
    if (filter === 'Follows') return notification.type === 'follow'
    return true
  })

  const handleNotificationClick = (notification) => {
    // In a real app, this would navigate to the relevant post or user
    if (notification.post) {
      console.log('Navigate to post:', notification.post)
    } else if (notification.type === 'follow') {
      console.log('Navigate to user:', notification.user.username)
    }
  }

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation()
    console.log('Mark as read:', notificationId)
  }

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div className="header-content">
          <h1>Notifications</h1>
          <button className="icon-button" type="button" aria-label="Mark all as read">
            <Check size={20} />
          </button>
        </div>
      </header>

      <div className="notifications-filters">
        {filters.map((f) => (
          <button
            key={f}
            className={filter === f.toLowerCase() ? 'active' : ''}
            type="button"
            onClick={() => setFilter(f.toLowerCase())}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-avatar">
                <div className="avatar avatar-green">
                  {notification.user.avatar ? (
                    <img src={notification.user.avatar} alt={notification.user.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-fallback">{getInitials(notification.user.name)}</span>
                  )}
                </div>
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-user">
                    <strong>{notification.user.name}</strong>
                    <span className="notification-username">{notification.user.username}</span>
                    <span className="notification-action">{getNotificationText(notification)}</span>
                  </div>
                  <div className="notification-actions">
                    <span className="notification-time">{notification.time}</span>
                    <button
                      className="notification-more"
                      type="button"
                      aria-label="More options"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {notification.post && (
                  <div className="notification-post">
                    <p>{notification.post.content}</p>
                  </div>
                )}

                {notification.type === 'follow' && (
                  <div className="notification-follow">
                    <button className="follow-button" type="button">
                      Follow back
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Bell size={48} />
            </div>
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default NotificationsPage
