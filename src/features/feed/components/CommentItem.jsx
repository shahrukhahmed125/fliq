import { Trash2, MoreHorizontal } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/helpers'
import { useState } from 'react'
import { commentService } from '@/services/commentService'

function CommentItem({ comment, onDelete, currentUserId }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return
    
    try {
      setIsDeleting(true)
      await commentService.deleteComment(comment.uuid)
      if (onDelete) {
        onDelete(comment.uuid)
      }
    } catch (error) {
      console.error('Delete comment error:', error)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const canDelete = currentUserId === comment.user?.id

  return (
    <article className="comment-item">
      <div className="comment-avatar">
        {comment.user?.profile_photo ? (
          <img
            src={comment.user.profile_photo}
            alt={comment.user.name}
            className="avatar-img"
          />
        ) : (
          getInitials(comment.user?.name)
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-user">
            <strong>{comment.user?.name || 'Unknown User'}</strong>
            <span>{comment.user?.username || 'user'}</span>
            <span>·</span>
            <span>{formatDate(comment.created_at)}</span>
          </div>

          {canDelete && (
            <div className="comment-menu">
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="More options"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="comment-dropdown">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="danger-menu-item"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="comment-text">{comment.content}</p>
      </div>
    </article>
  )
}

export default CommentItem
