import { Heart, MessageCircle, Repeat2, Send, Loader2 } from 'lucide-react'
import { getMediaUrl, formatDate } from '@/lib/helpers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '@/services/postService'
import CommentModal from './CommentModal'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={24} />
      <span>Processing...</span>
    </div>
  )
}

function PostCard({ post }) {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(post?.is_liked || false)
  const [likesCount, setLikesCount] = useState(post?.likes_count || post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post?.comments_count || 0)
  const [showCommentModal, setShowCommentModal] = useState(false)

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
      const response = await postService.toggleLike(post.uuid || post.id)
      
      // Update state based on response
      if (response) {
        setIsLiked(response.is_liked !== undefined ? response.is_liked : !isLiked)
        setLikesCount(response.likes_count !== undefined ? response.likes_count : (isLiked ? likesCount - 1 : likesCount + 1))
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentClick = (e) => {
    e.stopPropagation()
    setShowCommentModal(true)
  }

  const handlePostClick = () => {
    navigate(`/post/${post.uuid || post.id}`)
  }

  return (
    <article className="post-card" onClick={handlePostClick}>

      {/* USER */}
      <div className="avatar avatar-green">
        {post?.user?.name?.slice(0, 1) || 'U'}
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
            onClick={handleCommentClick}
          >
            <MessageCircle size={18} /> {commentsCount}
          </button>

          <button type="button">
            <Repeat2 size={18} /> {post?.reposts_count || 0}
          </button>

          <button 
            type="button" 
            onClick={handleLike}
            disabled={isLiking}
            className={isLiked ? 'liked' : ''}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            {isLiking ? (
              <Loader2 className="spinner" size={18} />
            ) : (
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            )}
            {likesCount}
          </button>

          <button type="button">
            <Send size={18} />
          </button>
        </div>

        {/* COMMENT MODAL */}
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          postUuid={post.uuid || post.id}
        />

      </div>
    </article>
  )
}

export default PostCard