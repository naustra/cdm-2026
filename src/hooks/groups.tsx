import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Tables } from '../lib/database.types'

type GroupRow = Tables<'groups'>

export function useCreateGroup() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [applyInGroup] = useApplyInGroup()

  return async (group: { name: string }) => {
    const joinKey = uuidv4().slice(0, 5).toUpperCase()
    const { error } = await supabase.from('groups').insert({
      ...group,
      created_by: user!.id,
      created_at: new Date().toISOString(),
      join_key: joinKey,
      members: [],
      awaiting_members: [],
    })

    if (error) {
      enqueueSnackbar('Erreur lors de la création du groupe', {
        variant: 'error',
      })
      return
    }

    await applyInGroup(joinKey)

    enqueueSnackbar(
      <>
        Groupe {group.name} créé avec le code <b>{joinKey}</b>.
      </>,
      { variant: 'success' },
    )
  }
}

export function useApplyInGroup() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const applyFn = useCallback(
    async (joinKey: string) => {
      const { data: groups } = await supabase
        .from('groups')
        .select('*')
        .eq('join_key', joinKey)

      if (!groups?.length) {
        enqueueSnackbar(
          <>
            Aucune tribu avec le code <b>{joinKey}</b> n&apos;existe
          </>,
          { variant: 'error' },
        )
        return
      }

      const group = groups[0]

      if (group.members?.includes(user!.id)) {
        enqueueSnackbar(
          <>
            Vous appartenez déjà à la tribu <b>{group.name}</b>
          </>,
          { variant: 'info' },
        )
        return
      }

      if (group.awaiting_members?.includes(user!.id)) {
        enqueueSnackbar(
          <>
            Vous avez déjà fait une demande pour rejoindre la tribu&nbsp;
            <b>{group.name}</b>
          </>,
          { variant: 'info' },
        )
        return
      }

      await supabase.from('group_apply').upsert({
        id: `${group.id}_${user!.id}`,
        user_id: user!.id,
        group_id: group.id,
        status: 'sent',
      })

      await supabase
        .from('groups')
        .update({
          awaiting_members: [...(group.awaiting_members || []), user!.id],
        })
        .eq('id', group.id)

      enqueueSnackbar(
        <>
          Inscription dans la tribu&nbsp;<b>{group.name}</b> !
        </>,
        { variant: 'success' },
      )
    },
    [user?.id, enqueueSnackbar],
  )

  return [applyFn] as const
}

export function useGroupsForUserMember(): GroupRow[] {
  const { user } = useAuth()
  const [groups, setGroups] = useState<GroupRow[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('groups')
      .select('*')
      .contains('members', [user.id])
      .then(({ data }) => setGroups(data ?? []))
  }, [user?.id])

  return groups
}

export function useGroupsForUser(): GroupRow[] {
  const { user } = useAuth()
  const [groups, setGroups] = useState<GroupRow[]>([])

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('groups').select('*').contains('members', [user.id]),
      supabase
        .from('groups')
        .select('*')
        .contains('awaiting_members', [user.id]),
    ]).then(([memberRes, awaitingRes]) => {
      const all = [...(memberRes.data ?? []), ...(awaitingRes.data ?? [])]
      const unique = all.filter(
        (g, i, arr) => arr.findIndex((x) => x.id === g.id) === i,
      )
      setGroups(unique)
    })
  }, [user?.id])

  return groups
}

export function useGroupCreatedByUser(): GroupRow[] {
  const { user } = useAuth()
  const [groups, setGroups] = useState<GroupRow[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('groups')
      .select('*')
      .eq('created_by', user.id)
      .then(({ data }) => setGroups(data ?? []))
  }, [user?.id])

  return groups
}

export function useGroupsContainingAwaitingMembers(): GroupRow[] {
  const [groups, setGroups] = useState<GroupRow[]>([])

  useEffect(() => {
    supabase
      .from('groups')
      .select('*')
      .not('awaiting_members', 'eq', '{}')
      .then(({ data }) => setGroups(data ?? []))
  }, [])

  return groups
}

export function useValidApply(groupId: string, userId: string) {
  const { enqueueSnackbar } = useSnackbar()

  return useCallback(async () => {
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (!group) {
      enqueueSnackbar('Groupe introuvable', { variant: 'error' })
      return
    }

    const newMembers = [...(group.members || []), userId]
    const newAwaiting = (group.awaiting_members || []).filter(
      (id) => id !== userId,
    )

    await supabase
      .from('groups')
      .update({ members: newMembers, awaiting_members: newAwaiting })
      .eq('id', groupId)

    await supabase
      .from('group_apply')
      .update({
        status: 'validated',
        validated_at: new Date().toISOString(),
      })
      .eq('id', `${groupId}_${userId}`)

    enqueueSnackbar('Joueur validé', { variant: 'success' })
  }, [groupId, userId, enqueueSnackbar])
}
