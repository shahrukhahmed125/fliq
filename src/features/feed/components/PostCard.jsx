import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react'

function PostCard({ post }) {
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
          <div className="post-media">
            {post.media.map((m) => (
              m.file_type === 'image' ? (
                <img key={m.id} src={m.file_path} alt="" />
              ) : (
                <video key={m.id} src={m.file_path} controls />
              )
            ))}
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