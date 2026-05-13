import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLockup from '../brand/BrandLockup'
import BackgroundPattern from './BackgroundPattern'
import { TextField } from '@mui/material'
import Spinner from '../ui/Spinner'

function ForgotPasswordPage({ theme }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleResetForm = () => {
    setFormData({ email: '' })
    setErrors({})
    setIsSubmitted(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-left">
          <BackgroundPattern />
          <div className="auth-content">
            <div className="auth-branding">
              <BrandLockup theme={theme} />
              <h1>Reset your password</h1>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
            </div>
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-form-container">
            {!isSubmitted ? (
              <>
                <form className="auth-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <TextField
                      name="email"
                      type="email"
                      label="Enter your email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      disabled={isLoading}
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
                  
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Spinner size={20} color="white" />
                        Sending reset link...
                      </span>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="auth-success">
                <div className="success-icon">✓</div>
                <h2>Check your email</h2>
                <p>We've sent a password reset link to <strong>{formData.email}</strong></p>
                <p className="success-instructions">
                  Click the link in the email to reset your password. If you don't see it, check your spam folder.
                </p>
                <button 
                  type="button" 
                  className="auth-submit-button secondary"
                  onClick={handleResetForm}
                >
                  Send another email
                </button>
              </div>
            )}
            
            <div className="auth-switch">
              <p>
                <button 
                  type="button" 
                  className="link-button"
                  onClick={() => navigate('/signin')}
                >
                  ← Back to sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
