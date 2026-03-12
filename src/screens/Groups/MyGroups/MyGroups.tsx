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
    <div className="group-card">
      <h3 className="group-card__title">Mes tribus</h3>
      <p className="group-card__desc">Les tribus dont vous faites partie</p>

      <div className="group-list">
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

  const badgeClass = isAdmin
    ? 'group-list-item__badge--admin'
    : isMember
      ? 'group-list-item__badge--member'
      : isAwaiting
        ? 'group-list-item__badge--awaiting'
        : ''

  const badgeLabel = isAdmin
    ? 'Admin'
    : isMember
      ? 'Membre'
      : isAwaiting
        ? 'En attente'
        : ''

  return (
    <div className="group-list-item">
      <span className="group-list-item__name">{group.name}</span>
      <span className="group-list-item__members">
        {group.members?.length ?? 0} membres
      </span>
      {group.join_key && (
        <span className="group-list-item__code">{group.join_key}</span>
      )}
      {badgeLabel && (
        <span className={`group-list-item__badge ${badgeClass}`}>
          {badgeLabel}
        </span>
      )}
    </div>
  )
}

export default MyGroups
