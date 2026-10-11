import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable centered Modal dialog for Fliq.
 * Guarantees horizontal and vertical centering, internal scrolling,
 * background lock, keyboard focus restoration, and Escape dismissal.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 580,
  className = '',
  ariaLabel,
  closeOnBackdrop = true,
  closeOnEscape = true,
  hideCloseButton = false,
}) {
  const previousActiveElementRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement

      // Prevent background scrolling while avoiding layout shifts
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      const originalOverflow = document.body.style.overflow
      const originalPaddingRight = document.body.style.paddingRight

      document.body.style.overflow = 'hidden'
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }

      // Auto-focus container or first focusable input
      const timer = setTimeout(() => {
        if (containerRef.current) {
          const focusable = containerRef.current.querySelector(
            'input, textarea, button:not(.modal-close-button), select, [tabindex="0"]'
          )
          if (focusable) {
            focusable.focus()
          } else {
            containerRef.current.focus()
          }
        }
      }, 50)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = originalOverflow
        document.body.style.paddingRight = originalPaddingRight
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus()
        }
      }
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const maxWidthStyle = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : ariaLabel || 'Dialog window'}
    >
      <div
        className="modal-backdrop"
        style={{ maxWidth: maxWidthStyle }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={containerRef}
          className={`modal-container ${className}`}
          tabIndex={-1}
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="modal-header">
              {typeof title === 'string' ? <h2>{title}</h2> : (title || <div />)}
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="modal-close-button"
                  aria-label="Close dialog"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {/* Content Body with internal scrolling */}
          <div className="modal-content">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
