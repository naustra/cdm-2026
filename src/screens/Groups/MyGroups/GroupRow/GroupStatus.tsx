interface GroupStatusProps {
  member: boolean
  admin: boolean
  awaiting: boolean
}

function getConfig({ admin, member, awaiting }: GroupStatusProps): { label: string; className: string } | null {
  if (admin) return { label: 'Admin', className: 'group-list-item__badge--admin' }
  if (member) return { label: 'Membre', className: 'group-list-item__badge--member' }
  if (awaiting) return { label: 'En attente', className: 'group-list-item__badge--awaiting' }
  return null
}

const GroupStatus = (props: GroupStatusProps) => {
  const config = getConfig(props)
  if (!config) return null

  return (
    <span className={`group-list-item__badge ${config.className}`}>
      {config.label}
    </span>
  )
}

export default GroupStatus
