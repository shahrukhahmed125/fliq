import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem('theme')
    } else {
      root.dataset.theme = theme
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  return { theme, setTheme }
}
