function BrandLockup({ theme }) {
  const logoSrc = theme === 'dark' 
    ? '/brand/fliq-logo-dark-cropped.png' 
    : '/brand/fliq-logo-light-cropped.png'

  return (
    <a className="brand-lockup" href="#top" aria-label="Fliq home">
      <img src={logoSrc} alt="Fliq" />
    </a>
  )
}

export default BrandLockup
