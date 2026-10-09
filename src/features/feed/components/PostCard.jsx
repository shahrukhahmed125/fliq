import { Loader2, MoreHorizontal } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faComment, faHeart, faRotate } from '@fortawesome/free-solid-svg-icons';
import { getMediaUrl, formatDate } from '@/lib/helpers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '@/services/postService'
import CommentModal from './CommentModal'
import PostComposerModal from './PostComposerModal'
import { useAuth } from '@/context/useAuth'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={24} />
      <span>Processing...</span>
    </div>
  )
}

function PostCard({ post, isComment = false, onDelete = null, postUuid = null, onReply = null, repostOf=null }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post?.is_liked || false)
  const [likesCount, setLikesCount] = useState(post?.likes_count || post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post?.replies_count || 0)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isRepost = !!post.reposted_post;
  const [isReposted, setIsReposted] = useState(post?.is_reposted || false)
  const [repostsCount, setRepostsCount] = useState(post?.reposts_count || post?.reposts || 0)
  const [isReposting, setIsReposting] = useState(false)
  const [hasReplied, setHasReplied] = useState(post?.has_replied || false)
  const [showRepostMenu, setShowRepostMenu] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)

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
      
        // Use post service for posts
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

  const handleRepost = async () => {
      if(isReposting) return

      try{
        setIsReposting(true)
        setShowRepostMenu(false)

        const formData = new FormData()
        formData.append('repost_of', post?.uuid || post?.id)

        // use post service
        const response = await postService.createRepost(formData)

        if (response) {
          setIsReposted(response.is_reposted !== undefined ? response.is_reposted : !isReposted)
          setRepostsCount(response.reposts_count !== undefined ? response.reposts_count : (isReposted ? repostsCount - 1 : repostsCount + 1))
        }

      }catch(error){
        console.error('Repost error:', error.response?.data || error)
      }finally{
        setIsReposting(false)
      }
  }

  const handleQuote = () => {
    setShowRepostMenu(false)
    setShowQuoteModal(true)
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
    <article className="post-card mb-2" onClick={handlePostClick}>

      {/* Header */}
      <div className="post-card-header">
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
        <div className="post-header-info">
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
      </div>

      {/* Content */}
      {post?.content && (
        <p className="post-content-text">{post?.content}</p>
      )}

      {/* Quoted / repost card */}
      {isRepost && (
        <div className="repost-original-post">
          <div className="repost-original-header">
            <div className="avatar avatar-green">
              {post?.reposted_post?.user?.profile_photo ? (
                <img
                  src={post.reposted_post.user.profile_photo}
                  alt="profile"
                  className="avatar-img"
                />
              ) : (
                post?.reposted_post?.user?.name?.slice(0, 1) || 'U'
              )}
            </div>
            <div className="repost-original-header-info">
              <strong>{post?.reposted_post?.user?.name || 'Unknown User'}</strong>
              <span>
                {post?.reposted_post?.user?.username || 'user'} ·
                {formatDate(post?.reposted_post?.created_at) || 'Unknown Date'}
              </span>
            </div>
          </div>
          {post?.reposted_post?.content && (
            <p className="repost-content-text">{post?.reposted_post?.content}</p>
          )}
          {post?.reposted_post?.media?.length > 0 && (
            <div className={`post-media ${getMediaClass()}`}>
              {post.reposted_post.media.map((m) => {
                if (m.status !== 'completed') {
                  return <LoadingPlaceholder key={m.id} />
                }
                return m.file_type === 'image' ? (
                  <img
                    key={m.id}
                    src={getMediaUrl(m.file_path)}
                    alt="Post media"
                    loading="lazy"
                  />
                ) : (
                  <video key={m.id} controls src={getMediaUrl(m.file_path)} />
                )
              })}
            </div>
          )}
        </div>
      )}

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
      <div className="post-actions-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="post-actions-pill">
          <button
            type="button"
            onClick={isComment ? handleReplyClick : handleCommentClick}
            aria-label={isComment ? 'Reply' : 'Comment'}
            className="action-button"
          >
            <FontAwesomeIcon icon={faComment} size="lg" style={{ color: hasReplied ? '#8181f1' : 'inherit', opacity: hasReplied ? 1 : 0.7 }} />
            {!isComment && commentsCount > 0 && <span>{commentsCount}</span>}
          </button>

          <div className="action-separator"></div>

          <div className="repost-button-container">
            <button
              type="button"
              onClick={() => setShowRepostMenu(!showRepostMenu)}
              disabled={isReposting}
              className={isReposted ? 'action-button reposted' : 'action-button'}
              aria-label={isReposted ? 'Undo repost' : 'Repost'}
            >
              {isReposting ? (
                <Loader2 className="spinner" size={18} />
              ) : (
                <FontAwesomeIcon icon={faRotate} size="lg" style={{ color: isReposted ? '#10b981' : 'inherit', opacity: isReposted ? 1 : 0.7 }} />
              )}

              {repostsCount > 0 && <span>{repostsCount}</span>}
            </button>

            {showRepostMenu && (
              <div className="repost-dropdown-menu">
                <button
                  type="button"
                  onClick={handleRepost}
                  disabled={isReposting}
                  className="repost-dropdown-item"
                >
                  <FontAwesomeIcon icon={faRotate} size={16} />
                  <span>Repost</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuote}
                  className="repost-dropdown-item"
                >
                  <FontAwesomeIcon icon={faShare} size={16} />
                  <span>Quote</span>
                </button>
              </div>
            )}
          </div>

          <div className="action-separator"></div>

          <button
            type="button"
            onClick={handleLike}
            disabled={isLiking}
            className={isLiked ? 'action-button liked' : 'action-button'}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiking ? (
              <Loader2 className="spinner" size={18} />
            ) : (
              <FontAwesomeIcon icon={faHeart} size="lg" style={{ color: isLiked ? '#ef4444' : 'inherit', opacity: isLiked ? 1 : 0.7 }} />
            )}
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>

          <div className="action-separator"></div>

          <button type="button" className="action-button">
            <FontAwesomeIcon icon={faShare} size="lg" className="share-icon" style={{ opacity: 0.7 }} />
          </button>
        </div>
      </div>

      {/* QUOTE MODAL */}
      {!isComment && (
        <PostComposerModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          title="Quote post"
          onPostSuccess={() => {
            setShowQuoteModal(false)
            setRepostsCount(prev => prev + 1)
          }}
        />
      )}

      {/* COMMENT MODAL */}
      {!isComment && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          postUuid={post.uuid || post.id}
        />
      )}
    </article>
  )
}

export default PostCard