import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react'

function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className={`avatar avatar-${post.accent}`}>{post.name.slice(0, 1)}</div>
      <div className="post-content">
        <header className="post-header">
          <div>
            <strong>{post.name}</strong>
            <span>{post.handle} - {post.time}</span>
          </div>
        </header>
        <p>{post.text}</p>
        <div className="post-actions" aria-label="Post actions">
          <button type="button"><MessageCircle size={18} /> {post.replies}</button>
          <button type="button"><Repeat2 size={18} /> {post.reposts}</button>
          <button type="button"><Heart size={18} /> {post.likes}</button>
          <button type="button"><Send size={18} /></button>
        </div>
      </div>
    </article>
  )
}

export default PostCard
