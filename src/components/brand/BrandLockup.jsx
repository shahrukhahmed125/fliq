import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

function BrandLockup({ theme }) {
  const navigate = useNavigate()
  const logoSrc = theme === 'dark' 
    ? '/brand/fliq-logo-dark-cropped.png' 
    : '/brand/fliq-logo-light-cropped.png'

  const handleClick = (e) => {
    e.preventDefault()
    navigate(ROUTES.HOME)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <a className="brand-lockup" href="/feed" onClick={handleClick} aria-label="Fliq Home">
      <img className="brand-logo-img" src={logoSrc} alt="Fliq" />
      <img className="brand-mark-collapsed" src="/brand/fliq-mark.png" alt="Fliq" />
    </a>
  )
}

export default BrandLockup
