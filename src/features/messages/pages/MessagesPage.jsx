import { useState } from 'react'
import { Search, MoreHorizontal, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'

function MessagesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: 'Ayesha Khan',
      username: '@ayeshawrites',
      avatar: null,
      lastMessage: 'That sounds great! Let me know when you\'re free.',
      time: '2m',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Hassan Ali',
      username: '@hassanbuilds',
      avatar: null,
      lastMessage: 'The project is coming along nicely.',
      time: '15m',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Zara Noor',
      username: '@zaracreates',
      avatar: null,
      lastMessage: 'Thanks for the feedback!',
      time: '1h',
      unread: 1,
      online: true
    },
    {
      id: 4,
      name: 'Bilal Ahmed',
      username: '@bilaldev',
      avatar: null,
      lastMessage: 'Can we schedule a call tomorrow?',
      time: '3h',
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: 'Mina Tariq',
      username: '@minatalks',
      avatar: null,
      lastMessage: 'Looking forward to it!',
      time: '1d',
      unread: 0,
      online: true
    }
  ]

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation)
  }

  return (
    <main className="messages-page">
      <header className="messages-header">
        <div className="header-content">
          <h1>Messages</h1>
          <button className="icon-button" type="button" aria-label="New message">
            <Edit3 size={20} />
          </button>
        </div>
      </header>

      <div className="messages-container">
        {/* Conversation List */}
        <div className="conversation-list">
          <div className="search-bar">
            <label className="search-box">
              <Search size={18} />
              <input
                placeholder="Search messages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="conversations">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="conversation-avatar">
                    <div className="avatar avatar-green">
                      {conversation.avatar ? (
                        <img src={conversation.avatar} alt={conversation.name} className="avatar-img" />
                      ) : (
                        <span className="avatar-fallback">{getInitials(conversation.name)}</span>
                      )}
                    </div>
                    {conversation.online && <span className="online-indicator" />}
                  </div>
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <strong>{conversation.name}</strong>
                      <span className="conversation-time">{conversation.time}</span>
                    </div>
                    <div className="conversation-meta">
                      <span className="conversation-username">{conversation.username}</span>
                      {conversation.unread > 0 && (
                        <span className="unread-badge">{conversation.unread}</span>
                      )}
                    </div>
                    <p className="conversation-message">{conversation.lastMessage}</p>
                  </div>
                  <button className="conversation-more" type="button" aria-label="More options">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat View */}
        {selectedConversation ? (
          <div className="chat-view">
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="avatar avatar-green">
                  {selectedConversation.avatar ? (
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-fallback">{getInitials(selectedConversation.name)}</span>
                  )}
                </div>
                <div>
                  <strong>{selectedConversation.name}</strong>
                  <span>{selectedConversation.username}</span>
                </div>
              </div>
              <button className="icon-button" type="button" aria-label="More options">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {/* Mock messages */}
              <div className="message received">
                <div className="avatar avatar-green avatar-small">
                  {selectedConversation.avatar ? (
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-fallback">{getInitials(selectedConversation.name)}</span>
                  )}
                </div>
                <div className="message-content">
                  <p>Hey! How are you doing?</p>
                  <span className="message-time">10:30 AM</span>
                </div>
              </div>

              <div className="message sent">
                <div className="message-content">
                  <p>I'm doing great! Just working on some new features.</p>
                  <span className="message-time">10:32 AM</span>
                </div>
              </div>

              <div className="message received">
                <div className="avatar avatar-green avatar-small">
                  {selectedConversation.avatar ? (
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-fallback">{getInitials(selectedConversation.name)}</span>
                  )}
                </div>
                <div className="message-content">
                  <p>{selectedConversation.lastMessage}</p>
                  <span className="message-time">{selectedConversation.time}</span>
                </div>
              </div>
            </div>

            <div className="chat-input">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Start a new message"
                  className="message-input"
                />
                <button className="send-button" type="button">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">
                <Edit3 size={48} />
              </div>
              <h2>Select a conversation</h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default MessagesPage
