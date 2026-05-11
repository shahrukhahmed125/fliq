import { useState } from 'react'
import BrandLockup from '../brand/BrandLockup'
import GoogleIcon from '../icons/GoogleIcon'
import AppleIcon from '../icons/AppleIcon'
import BackgroundPattern from './BackgroundPattern'
import axios from 'axios'

function SignUpPage({ onSignUp, onNavigateToSignIn, theme }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const API_URL = 'http://127.0.0.1:8080/api/register';

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

    if(Object.keys(validateForm()).length > 0) {
      setErrors(validateForm())
      return
    }

    try{
      setIsLoading(true)
      const response = await axios.post(API_URL, formData);
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      setFormData({
        name: '',
        email: '',
        password: '',
      });
    } catch (error) {
      // Laravel validation errors
      if (error.response?.status === 422) {

        const validationErrors = error.response.data.errors;

        let formattedErrors = {};

        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });

        setErrors(formattedErrors);

      } else {

        alert(
          error.response?.data?.message || 'Something went wrong'
        );
      }

    } finally {

      setIsLoading(false);
      onSignUp();

    }
  };

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
      onSignUp()
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
                onClick={() => handleSocialSignUp('google')}
                disabled={isLoading}
              >
                <GoogleIcon size={20} />
                Continue with Google
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
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
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
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <button 
                type="submit" 
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
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
                  onClick={onNavigateToSignIn}
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
