import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { commentService } from '@/services/commentService'
import CommentItem from './CommentItem'
import { useAuth } from '@/context/useAuth'

function CommentList({ postUuid, isOpen, onCommentCountChange }) {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && postUuid) {
      fetchComments()
    }
  }, [isOpen, postUuid])

  const fetchComments = async () => {
    if (!postUuid) return
    
    try {
      setIsLoading(true)
      const data = await commentService.getComments(postUuid)
      setComments(data)
      if (onCommentCountChange) {
        onCommentCountChange(data.length)
      }
    } catch (error) {
      console.error('Fetch comments error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteComment = (commentUuid) => {
    setComments((prev) => prev.filter((c) => c.uuid !== commentUuid))
    if (onCommentCountChange) {
      onCommentCountChange(comments.length - 1)
    }
  }

  const handleAddComment = (newComment) => {
    setComments((prev) => [newComment, ...prev])
    if (onCommentCountChange) {
      onCommentCountChange(comments.length + 1)
    }
  }

  if (!isOpen) return null

  return (
    <div className="comments-section">
      {isLoading ? (
        <div className="comments-loading">
          <Loader2 className="spinner" size={20} />
          <span>Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="comments-empty">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.uuid || comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentList
