import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import includes from 'lodash/includes'
import { useMemo } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import Avatar from '../../../../components/Avatar'
import { useOpponents } from '../../../../hooks/opponents'
import GroupStatus from './GroupStatus'

interface GroupRowProps {
  group: {
    name: string
    members?: string[]
    join_key?: string
    awaiting_members?: string[]
    created_by?: string
  }
}

const GroupRow = ({ group }: GroupRowProps) => {
  const { name, members, join_key, awaiting_members, created_by } = group
  const { user } = useAuth()
  const uid = user?.id
  const createdByArray = useMemo(
    () => (created_by ? [created_by] : []),
    [created_by],
  )
  const creators = useOpponents(createdByArray)
  const creator = creators?.[0]

  return (
    <TableRow>
      <TableCell>
        <b>{name}</b>
      </TableCell>
      <TableCell>
        <Avatar avatarUrl={creator?.avatar_url ?? undefined} />
      </TableCell>
      <TableCell>{members?.length ?? 0}</TableCell>
      <TableCell>
        <GroupStatus
          member={includes(members, uid)}
          awaiting={includes(awaiting_members, uid)}
          admin={created_by === uid}
        />
      </TableCell>
      <TableCell>{join_key}</TableCell>
    </TableRow>
  )
}

export default GroupRow
