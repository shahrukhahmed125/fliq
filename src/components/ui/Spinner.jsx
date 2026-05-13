import { CircularProgress } from '@mui/material'

function Spinner({ size = 24, color = 'accent' }) {
  const colorMap = {
    accent: 'var(--fliq-accent)',
    accentStrong: 'var(--fliq-accent-strong)',
    ink: 'var(--fliq-ink)',
    muted: 'var(--fliq-muted)',
    white: '#ffffff'
  }

  return (
    <CircularProgress
      size={size}
      sx={{
        color: colorMap[color] || colorMap.accent,
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        },
      }}
    />
  )
}

export default Spinner
