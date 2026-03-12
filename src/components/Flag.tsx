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
      alt={tooltipText || country}
      title={tooltipText || undefined}
      className={className}
      style={style}
    />
  )
})

const FlagPlaceholder = memo<{ className?: string; style?: CSSProperties }>(
  ({ className, style }) => (
    <div
      className={className}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5e7eb',
        borderRadius: '6px',
        color: '#9ca3af',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      ?
    </div>
  ),
)

Flag.displayName = 'Flag'
FlagPlaceholder.displayName = 'FlagPlaceholder'

export default Flag
