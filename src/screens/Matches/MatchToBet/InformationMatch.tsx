const phaseConfig: Record<
  string,
  { label: string; color: string; multiplier: number }
> = {
  '0': { label: '', color: '#6366f1', multiplier: 1 },
  '5': { label: '16es de finale', color: '#8b5cf6', multiplier: 1 },
  '6': { label: '8es de finale', color: '#a855f7', multiplier: 2 },
  '4': { label: 'Quarts de finale', color: '#d946ef', multiplier: 3 },
  '2': { label: 'Demi-finales', color: '#ec4899', multiplier: 5 },
  '3': { label: '3e place', color: '#f43f5e', multiplier: 7 },
  '1': { label: 'Finale', color: '#eab308', multiplier: 10 },
}

interface InformationMatchProps {
  phase: string
  groupName: string | null
}

const InformationMatch = ({ phase, groupName }: InformationMatchProps) => {
  const config = phaseConfig[phase] ?? phaseConfig['0']
  const label = phase === '0' ? `Groupe ${groupName ?? '?'}` : config.label

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
        style={{ backgroundColor: config.color }}
      >
        {label}
      </span>
      {config.multiplier > 1 && (
        <span
          className="phase-multiplier"
          style={{
            color: config.color,
            backgroundColor: `${config.color}14`,
            borderColor: `${config.color}30`,
          }}
        >
          ×{config.multiplier}
        </span>
      )}
    </span>
  )
}

export default InformationMatch
