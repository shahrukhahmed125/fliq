import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Repeat2, Send, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { postService } from '@/services/postService'
import { getMediaUrl, formatDate } from '@/lib/helpers'
import PostCard from '../components/PostCard'
import Composer from '../components/Composer'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'

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
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
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
      fetchComments()
    } catch (error) {
      console.error('Fetch post error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const data = await postService.getReplies(id)
      setComments(data)
    } catch (error) {
      console.error('Fetch replies error:', error)
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
    if (replyTo) {
      // If replying to a comment, add it as a nested reply
      setComments((prev) => {
        const addNestedReply = (comments) => {
          return comments.map((comment) => {
            if (comment.uuid === replyTo.uuid || comment.id === replyTo.id) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addNestedReply(comment.replies)
              }
            }
            return comment
          })
        }
        return addNestedReply(prev)
      })
    } else {
      // Top-level comment
      setComments((prev) => [newComment, ...prev])
    }
    handleCommentCountChange(commentsCount + 1)
    setReplyTo(null)
  }

  const handleDeleteComment = (commentUuid) => {
    setComments((prev) => {
      const removeComment = (comments) => {
        return comments.filter((comment) => {
          if (comment.uuid === commentUuid || comment.id === commentUuid) {
            return false
          }
          if (comment.replies && comment.replies.length > 0) {
            comment.replies = removeComment(comment.replies)
          }
          return true
        })
      }
      return removeComment(prev)
    })
    handleCommentCountChange(commentsCount - 1)
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
            {getInitials(post?.user?.name)}
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
          <Composer 
            postUuid={post.uuid || post.id}
            onCommentSuccess={handleCommentAdded}
            compact={true}
            replyTo={replyTo}
          />
        </div>

        <div className="post-detail-comments">
          {comments.length === 0 ? (
            <div className="comments-empty">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.uuid || comment.id} className="comment-thread">
                <PostCard
                  post={comment}
                  isComment={true}
                  onDelete={handleDeleteComment}
                  onReply={handleReply}
                />
                {comment.replies && comment.replies.length > 0 && (
                  <div className="comment-replies">
                    {comment.replies.map((reply) => (
                      <div key={reply.uuid || reply.id} className="comment-reply">
                        <PostCard
                          post={reply}
                          isComment={true}
                          onDelete={handleDeleteComment}
                          onReply={handleReply}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default PostDetailPage
