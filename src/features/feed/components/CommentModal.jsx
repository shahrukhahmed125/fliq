import PostComposerModal from './PostComposerModal'

function CommentModal({ isOpen, onClose, postUuid, onCommentAdded }) {
  const handleCommentSuccess = (commentData) => {
    if (onCommentAdded) {
      onCommentAdded(commentData)
    }
  }

  return (
    <PostComposerModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reply"
      postUuid={postUuid}
      onCommentAdded={handleCommentSuccess}
    />
  )
}

export default CommentModal
