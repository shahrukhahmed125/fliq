import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import { useTheme } from '@/hooks/useTheme'
import { storageService } from '@/services/storageService'
import './App.css'

function App() {
  const { theme, setTheme } = useTheme()

  const handleSignOut = () => {
    storageService.clear()
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        theme={theme} 
        onSignOut={handleSignOut} 
        onThemeChange={handleThemeChange} 
      />
    </BrowserRouter>
  )
}

export default App
