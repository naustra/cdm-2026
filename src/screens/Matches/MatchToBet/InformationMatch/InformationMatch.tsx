const phaseConfig: Record<
  string,
  { label: string; tooltip: string; color: string }
> = {
  '0': { label: '', tooltip: 'Phase de groupes (x1)', color: '#6366f1' },
  '5': {
    label: '16es de finale',
    tooltip: '16es de finale (x1)',
    color: '#8b5cf6',
  },
  '6': {
    label: '8es de finale',
    tooltip: '8es de finale (x2)',
    color: '#a855f7',
  },
  '4': {
    label: 'Quarts de finale',
    tooltip: 'Quarts de finale (x3)',
    color: '#d946ef',
  },
  '2': {
    label: 'Demi-finales',
    tooltip: 'Demi-finales (x5)',
    color: '#ec4899',
  },
  '3': {
    label: '3e place',
    tooltip: '3e place (x7)',
    color: '#f43f5e',
  },
  '1': {
    label: 'Finale',
    tooltip: 'Finale (x10)',
    color: '#eab308',
  },
}

interface InformationMatchProps {
  phase: string
  groupName: string | null
}

const InformationMatch = ({ phase, groupName }: InformationMatchProps) => {
  const config = phaseConfig[phase] ?? phaseConfig['0']
  const label = phase === '0' ? `Groupe ${groupName ?? '?'}` : config.label

  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
      style={{ backgroundColor: config.color }}
      title={config.tooltip}
    >
      {label}
    </span>
  )
}

export default InformationMatch
