import Composer from './Composer'
import Modal from '@/components/ui/Modal'

function PostComposerModal({
  isOpen,
  onClose,
  onPostSuccess,
  title = 'New post',
  postUuid = null,
  onCommentAdded = null,
}) {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={580}
    >
      <div className="modal-composer-full">
        <Composer
          onPostSuccess={handlePostSuccess}
          postUuid={postUuid}
          onCommentSuccess={handleCommentSuccess}
        />
      </div>
    </Modal>
  )
}

export default PostComposerModal
