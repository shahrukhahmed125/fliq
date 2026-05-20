import { Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { commentService } from '@/services/commentService'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'

function CommentForm({ postUuid, onCommentAdded }) {
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
      })
      
      setText('')
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
      <div className="comment-form-avatar">
        {user?.profile_photo ? (
          <img
            src={user.profile_photo}
            alt="profile"
            className="avatar-img"
          />
        ) : (
          getInitials(user?.name)
        )}
      </div>

      <div className="comment-form-body">
        <textarea
          placeholder="Write a comment..."
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <button
          type="submit"
          className="comment-submit-button"
          disabled={!text.trim() || isLoading}
          aria-label="Send comment"
        >
          {isLoading ? (
            <Loader2 className="spinner" size={16} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
