import { Heart, MessageCircle, Repeat2, Send, Loader2 } from 'lucide-react'
import { getMediaUrl } from '@/lib/helpers'

function LoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={24} />
      <span>Processing...</span>
    </div>
  )
}

function PostCard({ post }) {
  const mediaCount = post?.media?.length || 0
  const getMediaClass = () => {
    if (mediaCount === 1) return 'single'
    if (mediaCount === 2) return 'two'
    if (mediaCount === 3) return 'three'
    if (mediaCount === 4) return 'four'
    return ''
  }

  return (
    <article className="post-card">

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
              {new Date(post?.created_at).toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <p>{post?.content}</p>

        {/* MEDIA */}
        {post?.media?.length > 0 && (
          <div className={`post-media ${getMediaClass()}`}>
            {post.media.map((m) => {
              if (m.status !== 'completed') {
                return <LoadingPlaceholder key={m.id} />
              }

              return m.file_type === 'image' ? (
                <img key={m.id} src={getMediaUrl(m.file_path)} alt="" />
              ) : (
                <video key={m.id} src={getMediaUrl(m.file_path)} controls autoPlay />
              )
            })}
          </div>
        )}

        {/* ACTIONS (static for now) */}
        <div className="post-actions">
          <button type="button">
            <MessageCircle size={18} /> 0
          </button>

          <button type="button">
            <Repeat2 size={18} /> 0
          </button>

          <button type="button">
            <Heart size={18} /> 0
          </button>

          <button type="button">
            <Send size={18} />
          </button>
        </div>

      </div>
    </article>
  )
}

export default PostCard