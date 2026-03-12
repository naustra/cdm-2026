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
    <div className="flex items-center gap-3 py-2.5 px-3.5 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <b>{name}</b>
      </div>
      <div className="shrink-0">
        <Avatar
        avatarUrl={creator?.avatar_url ?? undefined}
        displayName={creator?.display_name ?? undefined}
      />
      </div>
      <div className="shrink-0">{members?.length ?? 0}</div>
      <div className="shrink-0">
        <GroupStatus
          member={includes(members, uid)}
          awaiting={includes(awaiting_members, uid)}
          admin={created_by === uid}
        />
      </div>
      <div className="shrink-0">{join_key}</div>
    </div>
  )
}

export default GroupRow
