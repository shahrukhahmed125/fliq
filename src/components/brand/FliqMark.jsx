function FliqMark({ compact = false }) {
  return (
    <img
      className={compact ? 'brand-mark compact' : 'brand-mark'}
      src="/brand/fliq-mark.png"
      alt=""
      aria-hidden="true"
    />
  )
}

export default FliqMark
