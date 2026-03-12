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
  if (!country) return <FlagPlaceholder className={className} style={style} />

  const flag = getFlagSrc(country)
  if (!flag) return <FlagPlaceholder className={className} style={style} />

  return (
    <img
      src={flag}
      alt={country}
      className={className}
      style={style}
      title={tooltipText ?? ''}
    />
  )
})

const FlagPlaceholder = memo<{ className?: string; style?: CSSProperties }>(
  ({ className, style }) => (
    <div
      className={`flex items-center justify-center bg-gray-200 rounded-md text-xs font-semibold text-gray-400 ${className ?? ''}`}
      style={style}
    >
      ?
    </div>
  ),
)

Flag.displayName = 'Flag'
FlagPlaceholder.displayName = 'FlagPlaceholder'

export default Flag
