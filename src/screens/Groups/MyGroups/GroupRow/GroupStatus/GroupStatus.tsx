import Chip from '@mui/material/Chip'

interface GroupStatusProps {
  member: boolean
  admin: boolean
  awaiting: boolean
}

function getLabel({ admin, member, awaiting }: GroupStatusProps) {
  if (admin) return 'Admin'
  if (member) return 'Membre'
  if (awaiting) return 'En attente'
  return undefined
}

const GroupStatus = (props: GroupStatusProps) => <Chip label={getLabel(props)} />

export default GroupStatus
