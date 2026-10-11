import { useState } from 'react'
import { Loader2, ImageOff } from 'lucide-react'
import { getMediaUrl } from '@/lib/helpers'
import MediaLightbox from './MediaLightbox'
import VideoPlayer from './VideoPlayer'

function MediaLoadingPlaceholder() {
  return (
    <div className="media-loading-placeholder">
      <Loader2 className="spinner" size={18} />
      <span>Loading media...</span>
    </div>
  )
}

function ImageTile({ mediaItem, index, isLastWithMore, moreCount, onClick }) {
  const [hasError, setHasError] = useState(false)
  const isVideo = mediaItem?.file_type === 'video' || (typeof mediaItem === 'string' && mediaItem.match(/\.(mp4|webm|ogg)$/i))
  const mediaUrl = typeof mediaItem === 'string' ? mediaItem : getMediaUrl(mediaItem?.file_path)

  if (mediaItem?.status && mediaItem.status !== 'completed') {
    return <MediaLoadingPlaceholder />
  }

  if (isVideo) {
    return (
      <div className="fliq-collage-tile video-tile" onClick={(e) => e.stopPropagation()}>
        <VideoPlayer src={mediaUrl} />
      </div>
    )
  }

  return (
    <div
      className={`fliq-collage-tile image-tile ${isLastWithMore ? 'tile-has-more' : ''}`}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(index)
        }
      }}
      aria-label={isLastWithMore ? `View ${moreCount} more images` : `View image ${index + 1}`}
    >
      {hasError ? (
        <div className="fliq-media-fallback">
          <ImageOff size={24} />
          <span>Image unavailable</span>
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt={`Media attachment ${index + 1}`}
          loading="lazy"
          className="fliq-collage-img"
          onError={() => setHasError(true)}
        />
      )}

      {/* WhatsApp-style +N overlay badge on 4th tile */}
      {isLastWithMore && (
        <div className="fliq-collage-more-overlay" aria-hidden="true">
          <span className="fliq-collage-more-count">+{moreCount}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Reusable Fliq Media Collage component supporting 1, 2, 3, 4, 5, 6, 7+ images/videos.
 * WhatsApp-style 4-tile grid with dynamic +N overlay and integrated lightbox.
 */
export default function MediaCollage({
  media = [],
  onMediaClick,
  enableLightbox = true,
  className = '',
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!media || media.length === 0) return null

  const totalCount = media.length
  // Display at most 4 tiles in the collage
  const displayedItems = totalCount > 4 ? media.slice(0, 4) : media
  const moreCount = totalCount > 4 ? totalCount - 4 : 0

  const getCollageLayoutClass = () => {
    if (totalCount === 1) return 'collage-single'
    if (totalCount === 2) return 'collage-two'
    if (totalCount === 3) return 'collage-three'
    return 'collage-four' // Used for 4 and 4+
  }

  const handleTileClick = (index) => {
    if (onMediaClick) {
      onMediaClick(index)
    } else if (enableLightbox) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  // Format URLs list for lightbox
  const allMediaUrls = media.map((m) => (typeof m === 'string' ? m : getMediaUrl(m.file_path)))

  return (
    <>
      <div
        className={`fliq-media-collage ${getCollageLayoutClass()} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {displayedItems.map((item, idx) => {
          const isFourthAndMore = idx === 3 && moreCount > 0
          return (
            <ImageTile
              key={item.id || item.uuid || idx}
              mediaItem={item}
              index={idx}
              isLastWithMore={isFourthAndMore}
              moreCount={moreCount}
              onClick={handleTileClick}
            />
          )
        })}
      </div>

      {/* Integrated Lightbox if enabled and no custom onMediaClick */}
      {enableLightbox && !onMediaClick && (
        <MediaLightbox
          isOpen={lightboxOpen}
          mediaList={allMediaUrls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
        />
      )}
    </>
  )
}
