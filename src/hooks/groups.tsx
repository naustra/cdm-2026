import toast from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Tables } from '../lib/database.types'

type GroupRow = Tables<'groups'>

export function useCreateGroup() {
  const { user } = useAuth()
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
      toast.error('Erreur lors de la création du groupe')
      return
    }

    await applyInGroup(joinKey)

    toast.success(`Groupe ${group.name} créé avec le code ${joinKey}`)
  }
}

export function useApplyInGroup(): [(joinKey: string) => Promise<void>] {
  const { user } = useAuth()

  const applyFn = useCallback(
    async (joinKey: string) => {
      const { data: groups } = await supabase
        .from('groups')
        .select('*')
        .eq('join_key', joinKey)

      if (!groups?.length) {
        toast.error(`Aucune tribu avec le code ${joinKey} n'existe`)
        return
      }

      const group = groups[0]

      if (group.members?.includes(user!.id)) {
        toast(`Vous appartenez déjà à la tribu ${group.name}`)
        return
      }

      const { error } = await supabase.from('group_apply').upsert({
        id: `${group.id}_${user!.id}`,
        user_id: user!.id,
        group_id: group.id,
      })

      if (error) {
        toast.error("Erreur lors de l'inscription")
        return
      }

      toast.success(`Inscription dans la tribu ${group.name} !`)
    },
    [user?.id],
  )

  return [applyFn]
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
  return useCallback(async () => {
    const { error } = await supabase.rpc('validate_group_apply', {
      p_group_id: groupId,
      p_user_id: userId,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Joueur validé')
  }, [groupId, userId])
}
