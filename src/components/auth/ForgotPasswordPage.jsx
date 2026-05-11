import { useState } from 'react'
import BrandLockup from '../brand/BrandLockup'
import BackgroundPattern from './BackgroundPattern'

function ForgotPasswordPage({ onBackToSignIn, theme }) {
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
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending reset link...' : 'Send reset link'}
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
                  onClick={onBackToSignIn}
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
