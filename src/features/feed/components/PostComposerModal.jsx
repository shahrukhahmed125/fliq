import { X } from 'lucide-react'
import { useEffect } from 'react'
import Composer from './Composer'

function PostComposerModal({ isOpen, onClose, onPostSuccess, title = 'New post', postUuid = null, onCommentAdded = null }) {
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

  const handlePostSuccess = (postData) => {
    if (onPostSuccess) {
      onPostSuccess(postData)
    }
    onClose()
  }

  const handleCommentSuccess = (commentData) => {
    if (onCommentAdded) {
      onCommentAdded(commentData)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <div className="modal-header">
            <h2>{title}</h2>
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
              <Composer 
                onPostSuccess={handlePostSuccess}
                postUuid={postUuid}
                onCommentSuccess={handleCommentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostComposerModal
