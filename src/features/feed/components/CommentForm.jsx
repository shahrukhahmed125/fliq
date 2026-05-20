import { Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { commentService } from '@/services/commentService'
import { useAuth } from '@/context/useAuth'

function CommentForm({ postUuid, onCommentAdded, replyTo = null, onCancelReply }) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || isLoading) return

    try {
      setIsLoading(true)
      const response = await commentService.createComment({
        post_uuid: postUuid,
        content: text.trim(),
        parent_id: replyTo?.uuid || null,
      })
      
      setText('')
      if (onCancelReply) {
        onCancelReply()
      }
      if (onCommentAdded) {
        onCommentAdded(response)
      }
    } catch (error) {
      console.error('Create comment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form-input-wrapper">
        <div className="comment-form-avatar">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt="profile"
              className="avatar-img"
            />
          ) : (
            <span>{user?.name?.slice(0, 1) || 'U'}</span>
          )}
        </div>

        <div className="comment-form-content">
          {replyTo && (
            <div className="comment-replying-to">
              <span>Replying to @{replyTo.user?.username || 'user'}</span>
              <button 
                type="button"
                onClick={onCancelReply}
                className="cancel-reply"
              >
                ✕
              </button>
            </div>
          )}
          
          <textarea
            placeholder={replyTo ? 'Write a reply...' : 'Post your reply'}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            className="comment-textarea"
          />
        </div>

        <button
          type="submit"
          className="comment-submit-button"
          disabled={!text.trim() || isLoading}
          aria-label="Post comment"
        >
          {isLoading ? (
            <Loader2 className="spinner" size={16} />
          ) : (
            'Post'
          )}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
