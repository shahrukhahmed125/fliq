import { X } from 'lucide-react'
import { useEffect } from 'react'
import CommentForm from './CommentForm'
import { useAuth } from '@/context/useAuth'
import { getInitials } from '@/lib/helpers'

function CommentModal({ isOpen, onClose, postUuid }) {
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCommentAdded = (newComment) => {
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <div className="modal-header">
            <h2>Reply</h2>
            <button 
              type="button"
              onClick={onClose}
              className="modal-close-button"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="modal-content">
            <div className="modal-composer-full">
              <section className="composer" aria-label="Reply to post">
                <div className="avatar avatar-green">
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="profile"
                      className="avatar-img"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="composer-body">
                  <CommentForm
                    postUuid={postUuid}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
