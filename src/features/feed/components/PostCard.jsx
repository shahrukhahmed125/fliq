import { Loader2, MoreHorizontal, MessageSquare, Repeat2, Heart, Bookmark, Share2, Check } from 'lucide-react'
import { getMediaUrl, formatDate, getInitials } from '@/lib/helpers'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '@/services/postService'
import CommentModal from './CommentModal'
import PostComposerModal from './PostComposerModal'
import { useAuth } from '@/context/useAuth'
import MediaLightbox from '@/components/ui/MediaLightbox'
import MediaCollage from '@/components/ui/MediaCollage'

function PostCard({ post, isComment = false, onDelete = null, _postUuid = null, onReply = null, _repostOf = null }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(post?.is_liked || false)
  const [likesCount, setLikesCount] = useState(post?.likes_count || post?.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post?.replies_count || post?.replies || 0)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isRepost = !!post?.reposted_post
  const [isReposted, setIsReposted] = useState(post?.is_reposted || false)
  const [repostsCount, setRepostsCount] = useState(post?.reposts_count || post?.reposts || 0)
  const [isReposting, setIsReposting] = useState(false)
  const [hasReplied, setHasReplied] = useState(post?.has_replied || false)
  const [showRepostMenu, setShowRepostMenu] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2200)
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    if (isLiking) return

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

  const handleRepost = async (e) => {
    e.stopPropagation()
    if (isReposting) return

    try {
      setIsReposting(true)
      setShowRepostMenu(false)

      const formData = new FormData()
      formData.append('repost_of', post?.uuid || post?.id)

      const response = await postService.createRepost(formData)

      if (response) {
        setIsReposted(response.is_reposted !== undefined ? response.is_reposted : !isReposted)
        setRepostsCount(response.reposts_count !== undefined ? response.reposts_count : (isReposted ? Math.max(0, repostsCount - 1) : repostsCount + 1))
        showToast(isReposted ? 'Repost removed' : 'Reposted to feed')
      }
    } catch (error) {
      console.error('Repost error:', error.response?.data || error)
    } finally {
      setIsReposting(false)
    }
  }

  const handleQuote = (e) => {
    e.stopPropagation()
    setShowRepostMenu(false)
    setShowQuoteModal(true)
  }

  const handleBookmark = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
    showToast(!isBookmarked ? 'Saved to Bookmarks' : 'Removed from Bookmarks')
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/post/${post?.uuid || post?.id}`
    try {
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard')
    } catch {
      showToast('Sharing post')
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (isDeleting) return

    try {
      setIsDeleting(true)
      await postService.deleteReply(post.uuid || post.id)
      if (onDelete) {
        onDelete(post.uuid || post.id)
      }
      showToast('Item deleted')
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
      navigate(`/post/${post?.uuid || post?.id}`)
    }
  }

  const canDelete = isComment && user?.id === post?.user?.id
  const authorName = post?.user?.name || post?.name || 'Unknown User'
  const authorUsername = post?.user?.username || post?.handle || '@user'
  const formattedTime = post?.created_at ? formatDate(post.created_at) : (post?.time || 'Just now')
  const contentText = post?.content || post?.text || ''

  return (
    <>
      <article className="post-card" onClick={handlePostClick} tabIndex={0} role="article" aria-label={`Post by ${authorName}`}>
        {/* Header Block */}
        <div className="post-card-header">
          <div className="avatar">
            {post?.user?.profile_photo ? (
              <img
                src={getMediaUrl(post.user.profile_photo)}
                alt={authorName}
                className="avatar-img"
              />
            ) : (
              getInitials(authorName)
            )}
          </div>

          <div className="post-header-info">
            <strong>{authorName}</strong>
            <span>{authorUsername}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedTime}</span>
          </div>

          {canDelete && (
            <div className="comment-menu" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-button"
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
                    style={{ color: 'var(--fliq-danger)', width: '100%', padding: '6px 10px', fontSize: '13px', textAlign: 'left' }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Text Body */}
        {contentText && (
          <p className="post-content-text">{contentText}</p>
        )}

        {/* Quoted / Repost Card */}
        {isRepost && (
          <div className="repost-original-post" onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.reposted_post?.uuid || post.reposted_post?.id}`); }}>
            <div className="repost-original-header">
              <div className="avatar avatar-small">
                {post.reposted_post?.user?.profile_photo ? (
                  <img
                    src={getMediaUrl(post.reposted_post.user.profile_photo)}
                    alt=""
                    className="avatar-img"
                  />
                ) : (
                  getInitials(post.reposted_post?.user?.name || 'User')
                )}
              </div>
              <div className="repost-original-header-info">
                <strong>{post.reposted_post?.user?.name || 'Unknown User'}</strong>
                <span>{post.reposted_post?.user?.username || '@user'} · {formatDate(post.reposted_post?.created_at)}</span>
              </div>
            </div>
            {post.reposted_post?.content && (
              <p className="repost-content-text">{post.reposted_post.content}</p>
            )}
            {post.reposted_post?.media?.length > 0 && (
              <div className="repost-media-wrap">
                <MediaCollage
                  media={post.reposted_post.media}
                  enableLightbox={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Media Attachments */}
        {post?.media?.length > 0 && (
          <MediaCollage
            media={post.media}
            onMediaClick={(idx) => {
              setLightboxIndex(idx)
              setLightboxOpen(true)
            }}
          />
        )}

        {/* Action Controls */}
        <div className="post-actions-wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="post-actions-pill">
            {/* Comment Trigger */}
            <button
              type="button"
              onClick={isComment ? handleReplyClick : handleCommentClick}
              aria-label={isComment ? 'Reply' : 'Comment'}
              className="action-button"
            >
              <MessageSquare size={16} strokeWidth={1.8} style={{ color: hasReplied ? 'var(--fliq-accent)' : 'inherit' }} />
              {commentsCount > 0 && <span>{commentsCount}</span>}
            </button>

            {/* Repost Trigger */}
            <div className="repost-button-container">
              <button
                type="button"
                onClick={() => setShowRepostMenu(!showRepostMenu)}
                disabled={isReposting}
                className={`action-button ${isReposted ? 'reposted' : ''}`}
                aria-label={isReposted ? 'Undo Repost' : 'Repost'}
              >
                {isReposting ? (
                  <Loader2 className="spinner" size={16} />
                ) : (
                  <Repeat2 size={17} strokeWidth={1.8} />
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
                    <Repeat2 size={15} />
                    <span>{isReposted ? 'Undo' : 'Repost'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuote}
                    className="repost-dropdown-item"
                  >
                    <MessageSquare size={15} />
                    <span>Quote</span>
                  </button>
                </div>
              )}
            </div>

            {/* Like Trigger */}
            <button
              type="button"
              onClick={handleLike}
              disabled={isLiking}
              className={`action-button ${isLiked ? 'liked' : ''}`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiking ? (
                <Loader2 className="spinner" size={16} />
              ) : (
                <Heart size={16} strokeWidth={1.8} fill={isLiked ? 'currentColor' : 'none'} />
              )}
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            {/* Bookmark Trigger */}
            <button
              type="button"
              onClick={handleBookmark}
              className={`action-button ${isBookmarked ? 'liked' : ''}`}
              aria-label="Bookmark"
            >
              <Bookmark size={16} strokeWidth={1.8} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            {/* Share Trigger */}
            <button
              type="button"
              onClick={handleShare}
              className="action-button"
              aria-label="Share"
            >
              <Share2 size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Quote Modal */}
        {!isComment && (
          <PostComposerModal
            isOpen={showQuoteModal}
            onClose={() => setShowQuoteModal(false)}
            title="Quote Post"
            onPostSuccess={() => {
              setShowQuoteModal(false)
              setRepostsCount((prev) => prev + 1)
              showToast('Quote posted')
            }}
          />
        )}

        {/* Comment Modal */}
        {!isComment && (
          <CommentModal
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            postUuid={post?.uuid || post?.id}
            onCommentAdded={() => {
              setCommentsCount((prev) => prev + 1)
              setHasReplied(true)
              showToast('Reply posted')
            }}
          />
        )}
        {/* Media Lightbox */}
        {post?.media?.length > 0 && (
          <MediaLightbox
            isOpen={lightboxOpen}
            mediaList={post.media.map((m) => getMediaUrl(m.file_path))}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
          />
        )}
      </article>

      {/* Floating Micro-Toast Feedback */}
      {toastMessage && (
        <div className="fliq-toast">
          <Check size={16} color="var(--fliq-accent)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  )
}

export default PostCard
