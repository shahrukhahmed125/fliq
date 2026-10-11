import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'

/**
 * Reusable Fliq Tabs with sliding active indicator, responsive auto-scroll,
 * full keyboard navigation, and reduced-motion support.
 */
export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Navigation tabs',
  variant = 'underline', // 'underline' | 'pill'
}) {
  const containerRef = useRef(null)
  const tabsRef = useRef([])
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const [isReady, setIsReady] = useState(false)

  // Normalize active index
  const activeIndex = typeof activeTab === 'number'
    ? activeTab
    : tabs.findIndex((tab) => {
        if (typeof tab === 'string') return tab.toLowerCase() === String(activeTab).toLowerCase()
        return tab.id === activeTab || tab.value === activeTab || tab.label === activeTab
      })

  const updateIndicator = useCallback(() => {
    if (activeIndex < 0 || !tabsRef.current[activeIndex] || !containerRef.current) {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
      return
    }

    const currentTabEl = tabsRef.current[activeIndex]
    const containerEl = containerRef.current
    const containerRect = containerEl.getBoundingClientRect()
    const tabRect = currentTabEl.getBoundingClientRect()

    const left = tabRect.left - containerRect.left + containerEl.scrollLeft
    const width = tabRect.width

    setIndicatorStyle({
      left,
      width,
      opacity: 1,
    })
  }, [activeIndex])

  // Update indicator position whenever active tab or container geometry changes
  useLayoutEffect(() => {
    updateIndicator()
    setIsReady(true)
  }, [updateIndicator])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Listen for resize to adjust indicator smoothly
    const resizeObserver = new ResizeObserver(() => {
      updateIndicator()
    })
    resizeObserver.observe(container)

    // Also observe each tab element
    tabsRef.current.forEach((el) => {
      if (el) resizeObserver.observe(el)
    })

    return () => resizeObserver.disconnect()
  }, [updateIndicator, tabs.length])

  // Smoothly scroll active tab into view if container is horizontally scrollable
  useEffect(() => {
    if (activeIndex >= 0 && tabsRef.current[activeIndex] && containerRef.current) {
      const activeEl = tabsRef.current[activeIndex]
      const container = containerRef.current

      // Check if container is overflowing
      if (container.scrollWidth > container.clientWidth) {
        const containerLeft = container.scrollLeft
        const containerRight = containerLeft + container.clientWidth
        const tabLeft = activeEl.offsetLeft
        const tabRight = tabLeft + activeEl.offsetWidth

        if (tabLeft < containerLeft || tabRight > containerRight) {
          activeEl.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          })
        }
      }
    }
  }, [activeIndex])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (tabs.length === 0) return

    let nextIndex = null
    if (e.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const targetTab = tabs[nextIndex]
      if (onChange) {
        onChange(typeof activeTab === 'number' ? nextIndex : (targetTab.id || targetTab.value || targetTab))
      }
      if (tabsRef.current[nextIndex]) {
        tabsRef.current[nextIndex].focus()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`fliq-tabs-container ${className} ${variant === 'pill' ? 'fliq-tabs-pill-variant' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab, index) => {
        const label = typeof tab === 'string' ? tab : tab.label
        const Icon = typeof tab === 'object' ? tab.icon : null
        const badge = typeof tab === 'object' ? tab.badge : null
        const isSelected = index === activeIndex

        return (
          <button
            key={label || index}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            type="button"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={`fliq-tab-btn ${isSelected ? 'active' : ''}`}
            onClick={() => {
              if (onChange) {
                onChange(typeof activeTab === 'number' ? index : (tab.id || tab.value || tab))
              }
            }}
          >
            {Icon && <Icon className="fliq-tab-icon" size={16} />}
            <span className="fliq-tab-label">{label}</span>
            {badge !== null && badge !== undefined && (
              <span className="fliq-tab-badge">{badge}</span>
            )}
          </button>
        )
      })}

      {/* Sliding Active Indicator */}
      <span
        className={`fliq-tabs-indicator ${variant === 'pill' ? 'pill-indicator' : 'underline-indicator'}`}
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          transition: isReady ? undefined : 'none',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
