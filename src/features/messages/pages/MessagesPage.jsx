import { useState } from 'react'
import { Search, Send, Edit3, ArrowLeft, MessageSquare, Paperclip, CheckCheck } from 'lucide-react'
import { getInitials } from '@/lib/helpers'

function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageInputText, setMessageInputText] = useState('')
  const [isTypingSimulated, setIsTypingSimulated] = useState(false)
  const [chatMessages, setChatMessages] = useState({
    1: [
      { id: 1, sender: 'them', text: 'Hey! Loved your thought on calmer social spaces.', time: '10:24 AM', reactions: ['❤️'] },
      { id: 2, sender: 'me', text: 'Thank you! We really need spaces that prioritize signal over outrage.', time: '10:28 AM', reactions: ['🔥'] },
      { id: 3, sender: 'them', text: "That sounds great! Let me know when you're free for a quick chat.", time: '10:30 AM', reactions: [] },
    ],
    2: [
      { id: 1, sender: 'them', text: 'The startup community meetup in Karachi is set for Saturday.', time: 'Yesterday', reactions: ['👍'] },
      { id: 2, sender: 'me', text: 'Count me in! Are we discussing product design?', time: 'Yesterday', reactions: [] },
    ],
    3: [
      { id: 1, sender: 'them', text: 'Shared the design tokens documentation with your team.', time: '2 days ago', reactions: ['✨'] },
    ],
    4: [
      { id: 1, sender: 'them', text: 'Can we schedule a call tomorrow morning?', time: '3h ago', reactions: [] },
    ],
  })

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Ayesha Khan',
      username: '@ayeshawrites',
      lastMessage: "That sounds great! Let me know when you're free.",
      time: '2m',
      unread: 1,
      online: true,
    },
    {
      id: 2,
      name: 'Hassan Ali',
      username: '@hassanbuilds',
      lastMessage: 'The project is coming along nicely.',
      time: '15m',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: 'Zara Noor',
      username: '@zaracreates',
      lastMessage: 'Thanks for the feedback on the tokens!',
      time: '1h',
      unread: 0,
      online: true,
    },
    {
      id: 4,
      name: 'Bilal Ahmed',
      username: '@bilaldev',
      lastMessage: 'Can we schedule a call tomorrow morning?',
      time: '3h',
      unread: 0,
      online: false,
    },
  ])

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInputText.trim() || !selectedConversation) return

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: messageInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    }

    setChatMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg],
    }))

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: messageInputText.trim(), time: 'Just now', unread: 0 }
          : c
      )
    )

    setMessageInputText('')

    // Brief realistic typing simulation from respondent
    setIsTypingSimulated(true)
    setTimeout(() => {
      setIsTypingSimulated(false)
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'them',
        text: 'Noted! Looking forward to collaborating.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: ['✨'],
      }
      setChatMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), replyMsg],
      }))
    }, 1800)
  }

  const handleToggleReaction = (msgId, emoji) => {
    if (!selectedConversation) return
    setChatMessages((prev) => {
      const list = prev[selectedConversation.id] || []
      return {
        ...prev,
        [selectedConversation.id]: list.map((msg) => {
          if (msg.id !== msgId) return msg
          const hasReaction = (msg.reactions || []).includes(emoji)
          return {
            ...msg,
            reactions: hasReaction
              ? (msg.reactions || []).filter((r) => r !== emoji)
              : [...(msg.reactions || []), emoji],
          }
        }),
      }
    })
  }

  const activeMessages = selectedConversation
    ? chatMessages[selectedConversation.id] || [
        { id: 1, sender: 'them', text: selectedConversation.lastMessage, time: selectedConversation.time, reactions: [] },
      ]
    : []

  return (
    <main className="messages-page">
      <header className="messages-header">
        <div className="header-content">
          <h1>Direct Messages</h1>
          <button
            className="modal-close-button"
            type="button"
            aria-label="Compose new message"
            title="New Message"
            onClick={() => {
              if (conversations.length > 0) {
                setSelectedConversation(conversations[0])
              }
            }}
          >
            <Edit3 size={17} />
          </button>
        </div>
      </header>

      <div className={`messages-container ${selectedConversation ? 'has-selected-conversation' : ''}`}>
        {/* Conversation List */}
        <div className="conversation-list">
          <div style={{ padding: '12px' }}>
            <div className="search-box">
              <Search size={15} />
              <input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="conversations">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConversation(conv)
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                    )
                  }}
                >
                  <div className="conversation-avatar">
                    <div className="avatar avatar-small">
                      {getInitials(conv.name)}
                    </div>
                    {conv.online && <span className="online-indicator" />}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-header">
                      <strong>{conv.name}</strong>
                      <span className="conversation-time">{conv.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <p className="conversation-message">{conv.lastMessage}</p>
                      {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Conversation View */}
        {selectedConversation ? (
          <div className="chat-view">
            <div className="chat-header">
              <div className="chat-user-info">
                <button
                  type="button"
                  onClick={() => setSelectedConversation(null)}
                  className="mobile-chat-back-btn"
                  aria-label="Back to conversations"
                  title="Back"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="avatar avatar-small">
                  {getInitials(selectedConversation.name)}
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--fliq-ink)' }}>{selectedConversation.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--fliq-muted)' }}>{selectedConversation.username}</span>
                    {selectedConversation.online && (
                      <span style={{ fontSize: '11px', color: 'var(--fliq-accent)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        ● Active now
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                  <div className="message-content">
                    <p>{msg.text}</p>
                    <div className="message-meta-row">
                      <span className="message-time">{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck size={13} color="var(--fliq-accent)" />}
                    </div>

                    {/* Reactions display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="message-reactions-row">
                        {msg.reactions.map((r, i) => (
                          <span key={i} className="reaction-chip" onClick={() => handleToggleReaction(msg.id, r)}>
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTypingSimulated && (
                <div className="message received typing-bubble">
                  <div className="message-content">
                    <span className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <form onSubmit={handleSendMessage} className="input-wrapper">
                <button
                  type="button"
                  className="chat-attach-btn"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  placeholder={`Reply to ${selectedConversation.name}...`}
                  className="message-input"
                  value={messageInputText}
                  onChange={(e) => setMessageInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={!messageInputText.trim()}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="chat-placeholder">
            <div className="placeholder-content">
              <div className="avatar" style={{ width: '52px', height: '52px', margin: '0 auto 10px auto', background: 'var(--fliq-soft)', color: 'var(--fliq-accent)' }}>
                <MessageSquare size={24} />
              </div>
              <strong style={{ fontSize: '16px', color: 'var(--fliq-ink)' }}>Select a conversation</strong>
              <p style={{ fontSize: '13px', maxWidth: '280px', color: 'var(--fliq-muted)' }}>
                Choose a direct discussion from the list or start a new note with creators on Fliq.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default MessagesPage
