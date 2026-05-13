import { useState } from 'react'
import BrandLockup from '../brand/BrandLockup'
import GoogleIcon from '../icons/GoogleIcon'
import AppleIcon from '../icons/AppleIcon'
import BackgroundPattern from './BackgroundPattern'
import axios from 'axios'
import { TextField } from '@mui/material'

function SignInPage({ onSignIn, onNavigateToSignUp, onNavigateToForgotPassword, theme }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const API_URL = 'http://127.0.0.1:8080/api/login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setGeneralError('')

    try {
      const response = await axios.post(API_URL, formData)
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Reset form
      setFormData({
        email: '',
        password: ''
      })
      
      // Call parent onSignIn function
      onSignIn()
      
    } catch (error) {
      // Handle Laravel validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors
        let formattedErrors = {}
        
        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0]
        })
        
        setErrors(formattedErrors)
      } else {
        // Handle other errors (invalid credentials, server errors, etc.)
        setGeneralError(
          error.response?.data?.message || 'Unable to sign in. Please check your credentials and try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
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
              <BrandLockup theme={theme} />
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
            
            {generalError && (
              <div className="auth-general-error">
                {generalError}
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <TextField
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      borderRadius: '28px',
                      backgroundColor: 'var(--fliq-surface)',
                      '& fieldset': {
                        borderColor: 'var(--fliq-border)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--fliq-border)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--fliq-accent)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--fliq-muted)',
                      '&.Mui-focused': {
                        color: 'var(--fliq-accent)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'var(--fliq-ink)',
                      fontSize: '16px',
                      fontWeight: 500,
                    },
                  }}
                />
              </div>
              
              <div className="form-group">
                <TextField
                  name="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                      borderRadius: '28px',
                      backgroundColor: 'var(--fliq-surface)',
                      '& fieldset': {
                        borderColor: 'var(--fliq-border)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--fliq-border)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--fliq-accent)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'var(--fliq-muted)',
                      '&.Mui-focused': {
                        color: 'var(--fliq-accent)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'var(--fliq-ink)',
                      fontSize: '16px',
                      fontWeight: 500,
                    },
                  }}
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
              <button type="button" className="link-button" onClick={onNavigateToForgotPassword}>
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
