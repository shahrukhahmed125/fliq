import { Heart, MessageCircle, Repeat2, Send, Loader2, MoreHorizontal } from 'lucide-react'
import { getMediaUrl, formatDate } from '@/lib/helpers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '@/services/postService'
import CommentModal from './CommentModal'
import { useAuth } from '@/context/useAuth'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={24} />
      <span>Processing...</span>
    </div>
  )
}

function PostCard({ post, isComment = false, onDelete = null, onReply = null }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post?.is_liked || false)
  const [likesCount, setLikesCount] = useState(post?.likes_count || post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post?.comments_count || 0)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const mediaCount = post?.media?.length || 0
  const getMediaClass = () => {
    if (mediaCount === 1) return 'single'
    if (mediaCount === 2) return 'two'
    if (mediaCount === 3) return 'three'
    if (mediaCount === 4) return 'four'
    return ''
  }

  const handleLike = async () => {
    if (isLiking) return
    
    try {
      setIsLiking(true)
      
      if (isComment) {
        // Use comment service for comments
        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
      } else {
        // Use post service for posts
        const response = await postService.toggleLike(post.uuid || post.id)
        
        if (response) {
          setIsLiked(response.is_liked !== undefined ? response.is_liked : !isLiked)
          setLikesCount(response.likes_count !== undefined ? response.likes_count : (isLiked ? likesCount - 1 : likesCount + 1))
        }
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    try {
      setIsDeleting(true)
      await postService.deleteReply(post.uuid || post.id)
      if (onDelete) {
        onDelete(post.uuid || post.id)
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const handleCommentClick = (e) => {
    e.stopPropagation()
    setShowCommentModal(true)
  }

  const handleReplyClick = (e) => {
    e.stopPropagation()
    if (onReply) {
      onReply(post)
    }
  }

  const handlePostClick = () => {
    if (!isComment) {
      navigate(`/post/${post.uuid || post.id}`)
    }
  }

  const canDelete = isComment && user?.id === post.user?.id

  return (
    <article className="post-card" onClick={handlePostClick}>

      {/* USER */}
      <div className="avatar avatar-green">
        {post?.user?.profile_photo ? (
          <img
            src={post.user.profile_photo}
            alt="profile"
            className="avatar-img"
          />
        ) : (
          post?.user?.name?.slice(0, 1) || 'U'
        )}
      </div>

      <div className="post-content">

        <header className="post-header">
          <div>
            <strong>{post?.user?.name || 'Unknown User'}</strong>

            <span>
              {post?.user?.username || 'user'} ·
              {formatDate(post?.created_at) || 'Unknown Date'}
            </span>
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
        </header>

        {/* CONTENT */}
        <p className="post-content-text">{post?.content}</p>

        {/* MEDIA */}
        {post?.media?.length > 0 && (
          <div className={`post-media ${getMediaClass()}`} onClick={(e) => e.stopPropagation()}>
            {post.media.map((m) => {
              if (m.status !== 'completed') {
                return <LoadingPlaceholder key={m.id} />
              }

              return m.file_type === 'image' ? (
                <img key={m.id} src={getMediaUrl(m.file_path)} alt="" />
              ) : (
                <video key={m.id} src={getMediaUrl(m.file_path)} controls />
              )
            })}
          </div>
        )}

        {/* ACTIONS */}
        <div className="post-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            onClick={isComment ? handleReplyClick : handleCommentClick}
            aria-label={isComment ? 'Reply' : 'Comment'}
          >
            <MessageCircle size={18} />
            {!isComment && commentsCount > 0 && <span>{commentsCount}</span>}
          </button>

          <button type="button">
            <Repeat2 size={18} /> {post?.reposts_count || 0}
          </button>

          <button 
            type="button" 
            onClick={handleLike}
            disabled={isLiking}
            className={isLiked ? 'liked' : ''}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiking ? (
              <Loader2 className="spinner" size={18} />
            ) : (
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            )}
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>

          <button type="button">
            <Send size={18} />
          </button>
        </div>

        {/* COMMENT MODAL */}
        {!isComment && (
          <CommentModal
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            postUuid={post.uuid || post.id}
          />
        )}

      </div>
    </article>
  )
}

export default PostCard