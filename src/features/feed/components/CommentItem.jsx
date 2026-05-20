import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/helpers'
import { useState } from 'react'
import { commentService } from '@/services/commentService'

function CommentItem({ comment, onDelete, onReply, currentUserId }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiked, setIsLiked] = useState(comment?.is_liked || false)
  const [likesCount, setLikesCount] = useState(comment?.likes_count || 0)
  const [isLiking, setIsLiking] = useState(false)
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

  const handleLike = async () => {
    if (isLiking) return
    
    try {
      setIsLiking(true)
      // Assuming there's a like endpoint for comments
      // For now, we'll just toggle locally
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    } catch (error) {
      console.error('Like comment error:', error)
    } finally {
      setIsLiking(false)
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
            <span>@{comment.user?.username || 'user'}</span>
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

        <div className="comment-actions">
          <button 
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            className={isLiked ? 'liked' : ''}
            aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>

          <button 
            type="button"
            onClick={() => onReply && onReply(comment)}
            aria-label="Reply to comment"
          >
            <MessageCircle size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default CommentItem
