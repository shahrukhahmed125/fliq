import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import { useTheme } from '@/hooks/useTheme'
import { storageService } from '@/services/storageService'
import { AuthProvider } from '@/context/AuthProvider'
import './App.css'

function App() {
  console.log('App component rendering...')
  const { theme, setTheme } = useTheme()
  console.log('Theme:', theme)

  const handleSignOut = () => {
    storageService.clear()
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes
          theme={theme}
          onSignOut={handleSignOut}
          onThemeChange={handleThemeChange}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
