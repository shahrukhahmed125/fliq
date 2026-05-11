import { useState } from 'react'
import BrandLockup from '../brand/BrandLockup'
import GoogleIcon from '../icons/GoogleIcon'
import AppleIcon from '../icons/AppleIcon'
import BackgroundPattern from './BackgroundPattern'

function SignInPage({ onSignIn, onNavigateToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      onSignIn()
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSocialSignIn = (provider) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onSignIn()
    }, 1000)
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-left">
          <BackgroundPattern />
          <div className="auth-content">
            <div className="auth-branding">
              <BrandLockup theme="light" />
              <h1>See what's happening</h1>
              <p>Join Fliq today to share your thoughts and connect with others.</p>
            </div>
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-social">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialSignIn('google')}
                disabled={isLoading}
              >
                <GoogleIcon size={20} />
                Continue with Google
              </button>
              <button 
                type="button" 
                className="social-button apple"
                onClick={() => handleSocialSignIn('apple')}
                disabled={isLoading}
              >
                <AppleIcon size={20} />
                Continue with Apple
              </button>
            </div>
            
            <div className="auth-divider">
              <span>or</span>
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            
            <div className="auth-options">
              <button type="button" className="link-button">
                Forgot password?
              </button>
            </div>
            
            <div className="auth-switch">
              <p>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="link-button"
                  onClick={onNavigateToSignUp}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
