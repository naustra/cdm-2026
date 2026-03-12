import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import { useGroupsForUser } from '../../../hooks/groups'
import { useAuth } from '../../../contexts/AuthContext'
import { useOpponents } from '../../../hooks/opponents'
import { useMemo } from 'react'

const MyGroups = () => {
  const groups = useGroupsForUser()

  if (isEmpty(groups)) return null

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <h3 className="text-lg font-bold text-navy m-0 mb-1">Mes tribus</h3>
      <p className="text-xs text-gray-400 m-0 mb-4">
        Les tribus dont vous faites partie
      </p>

      <div className="flex flex-col gap-2 mt-3">
        {groups.map((group) => (
          <GroupItem group={group} key={group.id} />
        ))}
      </div>
    </div>
  )
}

const GroupItem = ({ group }) => {
  const { user } = useAuth()
  const uid = user?.id
  const createdByArray = useMemo(
    () => (group.created_by ? [group.created_by] : []),
    [group.created_by],
  )
  const creators = useOpponents(createdByArray)
  const creator = creators?.[0]

  const isAdmin = group.created_by === uid
  const isMember = includes(group.members, uid)
  const isAwaiting = includes(group.awaiting_members, uid)

  const badgeLabel = isAdmin
    ? 'Admin'
    : isMember
      ? 'Membre'
      : isAwaiting
        ? 'En attente'
        : ''

  const badgeClasses = isAdmin
    ? 'bg-green-100 text-green-800'
    : isMember
      ? 'bg-blue-100 text-blue-800'
      : isAwaiting
        ? 'bg-amber-100 text-amber-800'
        : ''

  return (
    <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-[10px] bg-gray-50">
      <span className="flex-1 text-sm font-semibold text-navy">{group.name}</span>
      <span className="text-xs text-gray-400">
        {group.members?.length ?? 0} membres
      </span>
      {group.join_key && (
        <span className="text-[0.7rem] font-mono text-indigo-500 bg-indigo-50 py-0.5 px-2 rounded-md">
          {group.join_key}
        </span>
      )}
      {badgeLabel && (
        <span
          className={`text-[0.65rem] font-semibold py-0.5 px-2 rounded-full ${badgeClasses}`}
        >
          {badgeLabel}
        </span>
      )}
    </div>
  )
}

export default MyGroups
