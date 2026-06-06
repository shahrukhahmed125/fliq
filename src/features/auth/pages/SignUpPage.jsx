import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLockup from '@/components/brand/BrandLockup'
import GoogleIcon from '@/components/icons/GoogleIcon'
import AppleIcon from '@/components/icons/AppleIcon'
import BackgroundPattern from '@/features/auth/components/BackgroundPattern'
import { TextField } from '@mui/material'
import Spinner from '@/components/ui/Spinner'
import { authService } from '@/services/authService'
import { storageService } from '@/services/storageService'
import { ROUTES } from '@/lib/constants'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/context/useAuth'

function SignUpPage({ theme }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    if(Object.keys(validateForm()).length > 0) {
      setErrors(validateForm())
      return
    }

    try{
      setIsLoading(true)
      const response = await authService.register(formData)
      const user = response.data?.user || response.data
      const token = response.token
      
      login(user, token)

      setFormData({
        name: '',
        email: '',
        password: '',
      });
      navigate(ROUTES.HOME)
    } catch (error) {
      console.log("SIGN UP ERROR:", error.response?.data || error)
      // Laravel validation errors
      if (error.response?.status === 422) {

        const validationErrors = error.response.data.errors;

        let formattedErrors = {};

        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });

        setErrors(formattedErrors);

      } else {

        setGeneralError(
          error.response?.data?.message || 'Unable to create account. Please try again later.'
        );
      }

    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({

    onSuccess: async (tokenResponse) => {

      setIsGoogleLoading(true)
      setErrors({})
      setGeneralError('')

      try {

        const response = await authService.googleLogin(tokenResponse)
        const user = response.data?.user || response.data
        const token = response.token
        
        login(user, token)

        setFormData({
          email: '',
          password: ''
        })

        navigate(ROUTES.HOME)

      } catch (error) {

        console.log("GOOGLE LOGIN ERROR:", error.response?.data || error)
        if (error.response?.status === 422) {

          const validationErrors = error.response.data.errors
          let formattedErrors = {}

          Object.keys(validationErrors).forEach((key) => {
            formattedErrors[key] = validationErrors[key][0]
          })

          setErrors(formattedErrors)

        } else {

          setGeneralError(
            error.response?.data?.message ||
            'Unable to sign in. Please try again.'
          )
        }

      } finally {
        setIsGoogleLoading(false)
      }
    },

    onError: () => {
      setGeneralError('Google login failed')
    }

  })

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

  const handleSocialSignUp = (provider) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/feed')
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
              <h1>Join Fliq today</h1>
              <p>Create your account to share your thoughts, connect with people, and discover what's happening.</p>
            </div>
          </div>
        </div>
        
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-social">
              <button
                type="button"
                className="social-button google"
                onClick={() => googleLogin()}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Spinner size={20} color="white" />
                    Connecting...
                  </span>
                ) : (
                  <>
                    <GoogleIcon size={20} />
                    Continue with Google
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="social-button apple"
                onClick={() => handleSocialSignUp('apple')}
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
                  name="name"
                  type="text"
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name}
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
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Spinner size={20} color="white" />
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
              
              <p className="auth-terms">
                By signing up, you agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
              </p>
            </form>
            
            <div className="auth-switch">
              <p>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="link-button"
                  onClick={() => navigate(ROUTES.SIGN_IN)}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
