import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react'

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return '0:00'
  const totalSeconds = Math.floor(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className = '',
  style = {},
  aspectRatio = '16 / 9',
  onPlay,
  onPause,
  onEnded,
  crossOrigin,
  preload = 'metadata',
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const seekbarRef = useRef(null)
  const hideControlsTimerRef = useRef(null)
  const isHoveringControlsRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedPercent, setBufferedPercent] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(muted)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [hoverTime, setHoverTime] = useState(null)
  const [hoverPosition, setHoverPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(600)

  // Measure container dimensions for responsive layout adaptation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      setContainerWidth(container.clientWidth || 600)
    }
    updateSize()

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerWidth(entry.contentRect.width)
        }
      }
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const isCompact = containerWidth < 420
  const isExtraCompact = containerWidth < 280

  // Reset states if src changes
  useEffect(() => {
    setHasError(false)
    setIsLoading(false)
    setCurrentTime(0)
    setDuration(0)
  }, [src])

  // Sync mute state on initial mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
      setIsMuted(muted)
    }
  }, [muted])

  // Controls visibility management
  const scheduleHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current)
    }
    if (isPlaying && !isHoveringControlsRef.current && !showSpeedMenu && !isSeeking) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false)
        setShowSpeedMenu(false)
      }, 2800)
    }
  }, [isPlaying, showSpeedMenu, isSeeking])

  const handleShowControls = useCallback(() => {
    setShowControls(true)
    scheduleHideTimer()
  }, [scheduleHideTimer])

  const handleContainerMouseLeave = () => {
    if (isPlaying && !showSpeedMenu && !isSeeking) {
      setShowControls(false)
    }
  }

  const handleControlsMouseEnter = () => {
    isHoveringControlsRef.current = true
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current)
    }
    setShowControls(true)
  }

  const handleControlsMouseLeave = () => {
    isHoveringControlsRef.current = false
    scheduleHideTimer()
  }

  // Toggle controls on video click (great for mobile touch and desktop viewing)
  const handleVideoClick = (e) => {
    e.stopPropagation()
    if (showControls && isPlaying) {
      setShowControls(false)
      setShowSpeedMenu(false)
    } else {
      setShowControls(true)
      scheduleHideTimer()
    }
  }

  // Video event handlers
  const handlePlayPause = useCallback((e) => {
    if (e) e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            if (onPlay) onPlay()
            scheduleHideTimer()
          })
          .catch((err) => {
            console.warn('Video autoplay/play failed:', err)
            // If play was rejected due to browser autoplay policies, retry muted
            if (!video.muted) {
              video.muted = true
              setIsMuted(true)
              video.play().then(() => setIsPlaying(true)).catch(() => {})
            }
          })
      }
    } else {
      video.pause()
      setIsPlaying(false)
      setShowControls(true)
      if (onPause) onPause()
    }
  }, [onPlay, onPause, scheduleHideTimer])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || isSeeking) return
    setCurrentTime(video.currentTime)

    // Calculate buffer progress
    if (video.buffered && video.buffered.length > 0 && video.duration > 0) {
      try {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBufferedPercent(Math.min(100, (bufferedEnd / video.duration) * 100))
      } catch {
        // ignore
      }
    }
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration || 0)
    setIsLoading(false)
  }

  const handleWaiting = () => setIsLoading(true)
  const handleCanPlay = () => setIsLoading(false)
  const handlePlaying = () => {
    setIsLoading(false)
    setIsPlaying(true)
  }
  const handleVideoEnded = () => {
    setIsPlaying(false)
    setShowControls(true)
    if (onEnded) onEnded()
  }

  const handleVideoError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Seekbar interactions
  const calculateSeekTime = (clientX) => {
    const seekbar = seekbarRef.current
    if (!seekbar || !duration) return 0
    const rect = seekbar.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return pos * duration
  }

  const handleSeekStart = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
    if (clientX === undefined) return
    setIsSeeking(true)
    const newTime = calculateSeekTime(clientX)
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handleSeekMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX)
    if (clientX === undefined) return

    if (isSeeking) {
      const newTime = calculateSeekTime(clientX)
      setCurrentTime(newTime)
      if (videoRef.current) {
        videoRef.current.currentTime = newTime
      }
    }

    // Hover tooltip
    const seekbar = seekbarRef.current
    if (seekbar && duration) {
      const rect = seekbar.getBoundingClientRect()
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      setHoverPosition(pos * 100)
      setHoverTime(pos * duration)
    }
  }

  const handleSeekEnd = () => {
    setIsSeeking(false)
    scheduleHideTimer()
  }

  // Volume control
  const handleToggleMute = (e) => {
    if (e) e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    const nextMuted = !isMuted
    video.muted = nextMuted
    setIsMuted(nextMuted)
    if (nextMuted) {
      video.volume = 0
    } else {
      const restoredVolume = volume === 0 ? 0.8 : volume
      video.volume = restoredVolume
      setVolume(restoredVolume)
    }
  }

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return
    setVolume(val)
    video.volume = val
    if (val === 0) {
      video.muted = true
      setIsMuted(true)
    } else {
      video.muted = false
      setIsMuted(false)
    }
  }

  // Playback speed
  const handleSpeedSelect = (rate) => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = rate
      setPlaybackRate(rate)
    }
    setShowSpeedMenu(false)
    scheduleHideTimer()
  }

  // Fullscreen support
  const handleToggleFullscreen = (e) => {
    if (e) e.stopPropagation()
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {})
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current)
    }
  }, [])

  // Keyboard controls
  const handleKeyDown = (e) => {
    const video = videoRef.current
    if (!video) return

    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault()
      handlePlayPause()
    } else if (e.key === 'm') {
      e.preventDefault()
      handleToggleMute()
    } else if (e.key === 'f') {
      e.preventDefault()
      handleToggleFullscreen()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const newTime = Math.min(duration, video.currentTime + 5)
      video.currentTime = newTime
      setCurrentTime(newTime)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const newTime = Math.max(0, video.currentTime - 5)
      video.currentTime = newTime
      setCurrentTime(newTime)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newVol = Math.min(1, volume + 0.1)
      video.volume = newVol
      setVolume(newVol)
      setIsMuted(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newVol = Math.max(0, volume - 0.1)
      video.volume = newVol
      setVolume(newVol)
      if (newVol === 0) setIsMuted(true)
    }
  }

  const handleRetry = (e) => {
    if (e) e.stopPropagation()
    setHasError(false)
    setIsLoading(true)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const isControlsVisible = showControls || !isPlaying || hasError || isSeeking || showSpeedMenu

  return (
    <div
      ref={containerRef}
      className={`fliq-video-player-container ${className} ${isFullscreen ? 'is-fullscreen' : ''} ${isCompact ? 'size-compact' : ''} ${isExtraCompact ? 'size-extra-compact' : ''}`}
      style={{
        ...(aspectRatio && aspectRatio !== 'auto' ? { aspectRatio } : {}),
        ...style,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={handleShowControls}
      onTouchStart={handleShowControls}
      onMouseLeave={handleContainerMouseLeave}
      role="region"
      aria-label="Fliq video player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        preload={preload}
        crossOrigin={crossOrigin}
        playsInline
        className="fliq-video-element"
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
      />

      {/* Loading Buffering Indicator */}
      {isLoading && !hasError && (
        <div className="fliq-video-buffering-overlay" aria-label="Buffering video">
          <Loader2 className="fliq-video-spinner" size={38} />
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="fliq-video-error-overlay" role="alert">
          <AlertCircle size={32} className="fliq-video-error-icon" />
          <p className="fliq-video-error-text">Unable to play video</p>
          <button
            type="button"
            className="fliq-video-retry-btn"
            onClick={handleRetry}
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Big Center Play Button Overlay */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          type="button"
          className="fliq-video-center-play-btn"
          onClick={handlePlayPause}
          aria-label="Play video"
        >
          <span className="center-play-icon-wrap">
            <Play size={24} className="center-play-icon" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Custom Control Bar (Floating Glass Island) */}
      {controls && !hasError && (
        <div
          className={`fliq-video-controls-bar ${isControlsVisible ? 'visible' : 'hidden'} ${isCompact ? 'is-compact' : ''} ${isExtraCompact ? 'is-extra-compact' : ''}`}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}
        >
          {/* Progress / Seekbar */}
          <div
            ref={seekbarRef}
            className="fliq-video-seekbar-wrapper"
            onMouseDown={handleSeekStart}
            onMouseMove={handleSeekMove}
            onMouseUp={handleSeekEnd}
            onMouseLeave={() => setHoverTime(null)}
            onTouchStart={handleSeekStart}
            onTouchMove={handleSeekMove}
            onTouchEnd={handleSeekEnd}
            role="slider"
            aria-label="Seek progress slider"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            tabIndex={0}
          >
            <div className="fliq-video-seekbar-track">
              {/* Buffer Bar */}
              <div
                className="fliq-video-seekbar-buffer"
                style={{ width: `${bufferedPercent}%` }}
              />
              {/* Played Bar */}
              <div
                className="fliq-video-seekbar-played"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="fliq-video-seekbar-thumb" />
              </div>
            </div>

            {/* Hover timestamp tooltip */}
            {hoverTime !== null && (
              <div
                className="fliq-video-seek-tooltip"
                style={{ left: `${hoverPosition}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Bottom Controls Row */}
          <div className="fliq-video-bottom-controls">
            <div className="fliq-video-controls-left">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                className="fliq-video-ctrl-btn"
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause (k)' : 'Play (k)'}
              >
                {isPlaying ? (
                  <Pause size={17} fill="currentColor" />
                ) : (
                  <Play size={17} fill="currentColor" />
                )}
              </button>

              {/* Volume & Mute */}
              <div className="fliq-video-volume-group">
                <button
                  type="button"
                  className="fliq-video-ctrl-btn"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={17} />
                  ) : volume < 0.5 ? (
                    <Volume1 size={17} />
                  ) : (
                    <Volume2 size={17} />
                  )}
                </button>
                {!isCompact && (
                  <div className="fliq-video-volume-slider-wrap">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="fliq-video-volume-slider"
                      aria-label="Volume slider"
                    />
                  </div>
                )}
              </div>

              {/* Timestamp Counter */}
              <div className="fliq-video-time-counter">
                <span className="current">{formatTime(currentTime)}</span>
                {!isExtraCompact && (
                  <>
                    <span className="separator">/</span>
                    <span className="duration">{formatTime(duration)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="fliq-video-controls-right">
              {/* Playback Speed Menu */}
              {!isExtraCompact && (
                <div className="fliq-video-speed-wrapper">
                  <button
                    type="button"
                    className="fliq-video-ctrl-btn speed-toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowSpeedMenu(!showSpeedMenu)
                    }}
                    aria-label="Playback speed"
                    title="Playback speed"
                  >
                    <span>{playbackRate === 1 ? '1x' : `${playbackRate}x`}</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="fliq-video-speed-menu">
                      {SPEED_OPTIONS.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          className={`speed-option-item ${playbackRate === rate ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSpeedSelect(rate)
                          }}
                        >
                          <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen Toggle */}
              <button
                type="button"
                className="fliq-video-ctrl-btn"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                title={isFullscreen ? 'Exit fullscreen (f)' : 'Fullscreen (f)'}
              >
                {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
