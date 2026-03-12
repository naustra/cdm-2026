import { Tooltip } from '@mui/material'
import { memo, type CSSProperties } from 'react'

interface FlagProps {
  country?: string
  tooltipText?: string
  className?: string
  style?: CSSProperties
}

const flags = import.meta.glob('../assets/flags/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function getFlagSrc(country: string): string | undefined {
  return flags[`../assets/flags/${country}.svg`]
}

const Flag = memo<FlagProps>(({ country, tooltipText, className, style }) => {
  if (!country) return null

  const flag = getFlagSrc(country)
  if (!flag) return null

  return (
    <Tooltip title={tooltipText ?? ''} placement="top" enterTouchDelay={0}>
      <img src={flag} alt={country} className={className} style={style} />
    </Tooltip>
  )
})

Flag.displayName = 'Flag'

export default Flag
