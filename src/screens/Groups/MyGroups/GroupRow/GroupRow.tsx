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
    <div className="group-list-item">
      <span className="group-list-item__name">{name}</span>
      <Avatar avatarUrl={creator?.avatar_url ?? undefined} size={24} />
      <span className="group-list-item__members">{members?.length ?? 0}</span>
      <GroupStatus
        member={includes(members, uid)}
        awaiting={includes(awaiting_members, uid)}
        admin={created_by === uid}
      />
      {join_key && (
        <span className="group-list-item__code">{join_key}</span>
      )}
    </div>
  )
}

export default GroupRow
