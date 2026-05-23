import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Repeat2, Send, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { postService } from '@/services/postService'
import { getMediaUrl, formatDate } from '@/lib/helpers'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={24} />
      <span>Processing...</span>
    </div>
  )
}

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPost(id)
      setPost(data)
      setIsLiked(data?.is_liked || false)
      setLikesCount(data?.likes_count || data?.likes || 0)
      setCommentsCount(data?.comments_count || 0)
    } catch (error) {
      console.error('Fetch post error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (isLiking) return
    
    try {
      setIsLiking(true)
      const response = await postService.toggleLike(post.uuid || post.id)
      
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

  const handleCommentCountChange = (newCount) => {
    setCommentsCount(newCount)
  }

  const handleReply = (comment) => {
    setReplyTo(comment)
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  const handleCommentAdded = (newComment) => {
    handleCommentCountChange(commentsCount + 1)
    setReplyTo(null)
  }

  const mediaCount = post?.media?.length || 0
  const getMediaClass = () => {
    if (mediaCount === 1) return 'single'
    if (mediaCount === 2) return 'two'
    if (mediaCount === 3) return 'three'
    if (mediaCount === 4) return 'four'
    return ''
  }

  if (isLoading) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-header">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <h2>Post</h2>
        </div>
        <div className="loading-spinner">
          <Loader2 className="spinner" size={32} />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-header">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <ArrowLeft size={20} />
          </button>
          <h2>Post</h2>
        </div>
        <div className="post-detail-error">
          <p>Post not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-header">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Post</h2>
      </div>

      <div className="post-detail-content">
        <article className="post-card post-detail-card">
          <div className="avatar avatar-green">
            {post?.user?.name?.slice(0, 1) || 'U'}
          </div>

          <div className="post-content">
            <header className="post-header">
              <div>
                <strong>{post?.user?.name || 'Unknown User'}</strong>
                <span>
                  @{post?.user?.username || 'user'} ·
                  {formatDate(post?.created_at) || 'Unknown Date'}
                </span>
              </div>
            </header>

            <p>{post?.content}</p>

            {post?.media?.length > 0 && (
              <div className={`post-media ${getMediaClass()}`}>
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

            <div className="post-actions">
              <button type="button">
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
          </div>
        </article>
        <div className="post-detail-comment-form">
          <CommentForm
            postUuid={post.uuid || post.id}
            replyTo={replyTo}
            onCancelReply={handleCancelReply}
            onCommentAdded={handleCommentAdded}
          />
        </div>

        <div className="post-detail-comments">
          <CommentList
            postUuid={post.uuid || post.id}
            isOpen={true}
            onCommentCountChange={handleCommentCountChange}
            onReply={handleReply}
          />
        </div>

      </div>
    </div>
  )
}

export default PostDetailPage
