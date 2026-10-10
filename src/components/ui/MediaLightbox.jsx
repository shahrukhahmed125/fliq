import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

function MediaLightbox({ isOpen, mediaList = [], currentIndex = 0, onClose, onNavigate }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1)
      } else if (e.key === 'ArrowRight' && currentIndex < mediaList.length - 1) {
        onNavigate(currentIndex + 1)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, currentIndex, mediaList.length, onClose, onNavigate])

  if (!isOpen || mediaList.length === 0) return null

  const currentMedia = mediaList[currentIndex]
  const isVideo = currentMedia?.match(/\.(mp4|webm|ogg)$/i)

  return (
    <div className="fliq-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Media viewer">
      <div className="fliq-lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls */}
        <div className="fliq-lightbox-topbar">
          <div className="fliq-lightbox-counter">
            {mediaList.length > 1 && (
              <span>{currentIndex + 1} / {mediaList.length}</span>
            )}
          </div>
          <div className="fliq-lightbox-actions">
            <a
              href={currentMedia}
              download
              target="_blank"
              rel="noreferrer"
              className="fliq-lightbox-btn"
              title="Open full resolution"
              aria-label="Open full resolution"
            >
              <Maximize2 size={18} />
            </a>
            <button
              type="button"
              className="fliq-lightbox-btn close"
              onClick={onClose}
              aria-label="Close media viewer"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Media Canvas */}
        <div className="fliq-lightbox-stage">
          {currentIndex > 0 && (
            <button
              type="button"
              className="fliq-lightbox-nav prev"
              onClick={() => onNavigate(currentIndex - 1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <div className="fliq-lightbox-media-wrap">
            {isVideo ? (
              <video
                src={currentMedia}
                controls
                autoPlay
                className="fliq-lightbox-media"
              />
            ) : (
              <img
                src={currentMedia}
                alt="Enlarged media preview"
                className="fliq-lightbox-media"
              />
            )}
          </div>

          {currentIndex < mediaList.length - 1 && (
            <button
              type="button"
              className="fliq-lightbox-nav next"
              onClick={() => onNavigate(currentIndex + 1)}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaLightbox
