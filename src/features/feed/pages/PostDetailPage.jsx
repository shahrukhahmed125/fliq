import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageSquare, Repeat2, Share2, Loader2, Feather, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { postService } from '@/services/postService'
import { getMediaUrl, formatDate, getInitials } from '@/lib/helpers'
import PostCard from '../components/PostCard'
import Composer from '../components/Composer'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--fliq-muted)' }}>
      <Loader2 className="spinner" size={20} />
      <span>Loading visual...</span>
    </div>
  )
}

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const [replyTo, setReplyTo] = useState(null)

  const fetchComments = useCallback(async () => {
    try {
      const data = await postService.getReplies(id)
      setComments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch replies error:', error)
    }
  }, [id])

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPost(id)
      setPost(data)
      setIsLiked(data?.is_liked || false)
      setLikesCount(data?.likes_count || data?.likes || 0)
      setCommentsCount(data?.comments_count || data?.replies_count || 0)
      fetchComments()
    } catch (error) {
      console.error('Fetch post error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id, fetchComments])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleLike = async () => {
    if (isLiking || !post) return

    try {
      setIsLiking(true)
      const response = await postService.toggleLike(post.uuid || post.id)

      if (response) {
        const nextLiked = response.is_liked !== undefined ? response.is_liked : response.liked !== undefined ? response.liked : !isLiked
        setIsLiked(nextLiked)
        if (response.likes_count !== undefined) {
          setLikesCount(response.likes_count)
        } else {
          setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))
        }
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleReply = (comment) => {
    setReplyTo(comment)
    document.querySelector('.post-detail-comment-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCommentAdded = (newComment) => {
    if (replyTo) {
      setComments((prev) => {
        const addNestedReply = (list) => {
          return list.map((comment) => {
            if (comment.uuid === replyTo.uuid || comment.id === replyTo.id) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addNestedReply(comment.replies),
              }
            }
            return comment
          })
        }
        return addNestedReply(prev)
      })
    } else {
      setComments((prev) => [newComment, ...prev])
    }
    setCommentsCount((prev) => prev + 1)
    setReplyTo(null)
  }

  const handleDeleteComment = (commentUuid) => {
    setComments((prev) => {
      const removeComment = (list) => {
        return list.filter((comment) => {
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
    setCommentsCount((prev) => Math.max(0, prev - 1))
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
          <button type="button" onClick={() => navigate(-1)} className="back-button" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <h2>Post</h2>
        </div>
        <div className="loading-spinner">
          <Loader2 className="spinner" size={28} />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-header">
          <button type="button" onClick={() => navigate(-1)} className="back-button" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <h2>Conversation</h2>
        </div>
        <div className="empty-state">
          <p>This discussion could not be found or has been removed.</p>
        </div>
      </div>
    )
  }

  const authorName = post?.user?.name || post?.name || 'Unknown User'
  const authorUsername = post?.user?.username || post?.handle || '@user'
  const contentText = post?.content || post?.text || ''

  return (
    <div className="post-detail-page">
      {/* Top Header */}
      <div className="post-detail-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h2>Thread</h2>
      </div>

      <div className="post-detail-content">
        {/* Main Post Spotlight */}
        <article className="post-card post-detail-card">
          <div className="post-card-header">
            <div className="avatar">
              {post?.user?.profile_photo ? (
                <img src={getMediaUrl(post.user.profile_photo)} alt={authorName} className="avatar-img" />
              ) : (
                getInitials(authorName)
              )}
            </div>
            <div className="post-header-info">
              <strong>{authorName}</strong>
              <span>{authorUsername}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(post?.created_at)}</span>
            </div>
          </div>

          <p className="post-content-text" style={{ fontSize: '17px', lineHeight: '1.6', marginTop: '6px' }}>
            {contentText}
          </p>

          {post?.media?.length > 0 && (
            <div className={`post-media ${getMediaClass()}`}>
              {post.media.map((m) => {
                if (m.status !== 'completed') return <LoadingPlaceholder key={m.id} />
                return m.file_type === 'image' ? (
                  <img key={m.id} src={getMediaUrl(m.file_path)} alt="" />
                ) : (
                  <video key={m.id} src={getMediaUrl(m.file_path)} controls />
                )
              })}
            </div>
          )}

          {/* Detailed Interaction Row */}
          <div className="post-actions-wrapper" style={{ marginTop: '12px' }}>
            <div className="post-actions-pill">
              <button type="button" className="action-button">
                <MessageSquare size={16} />
                <span>{commentsCount}</span>
              </button>

              <button type="button" className="action-button">
                <Repeat2 size={17} />
                <span>{post?.reposts_count || 0}</span>
              </button>

              <button
                type="button"
                onClick={handleLike}
                disabled={isLiking}
                className={`action-button ${isLiked ? 'liked' : ''}`}
              >
                {isLiking ? (
                  <Loader2 className="spinner" size={16} />
                ) : (
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                )}
                <span>{likesCount}</span>
              </button>

              <button
                type="button"
                className="action-button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </article>

        {/* Inline Reply Form */}
        <div className="post-detail-comment-form">
          {replyTo && (
            <div className="reply-to-context-pill">
              <span>Replying to <strong>{replyTo.user?.name || replyTo.name || 'Author'}</strong></span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                aria-label="Cancel reply context"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fliq-muted)' }}
              >
                <X size={13} />
              </button>
            </div>
          )}
          <Composer
            postUuid={post.uuid || post.id}
            onCommentSuccess={handleCommentAdded}
            compact={true}
            replyTo={replyTo}
          />
        </div>

        {/* Threaded Replies */}
        <div className="post-detail-comments">
          {comments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Feather size={32} />
              </div>
              <p>No replies yet. Start the conversation.</p>
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
