import { Hash, Image } from 'lucide-react'

function Composer({ compact = false }) {
  return (
    <section className={compact ? 'composer compact-composer' : 'composer'} aria-label="Create post">
      <div className="avatar avatar-green">A</div>
      <div className="composer-body">
        <textarea placeholder="What should Pakistan talk about today?" rows={compact ? 2 : 3} />
        <div className="composer-actions">
          <div className="composer-tools">
            <button type="button" aria-label="Add image">
              <Image size={18} />
            </button>
            <button type="button" aria-label="Add topic">
              <Hash size={18} />
            </button>
          </div>
          <button className="primary-action" type="button">Post</button>
        </div>
      </div>
    </section>
  )
}

export default Composer
