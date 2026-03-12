import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../lib/database.types'

type Profile = Tables<'profiles'>

export function useUsers(userIds: string[] | undefined): Profile[] {
  const [users, setUsers] = useState<Profile[]>([])

  useEffect(() => {
    if (!userIds?.length) return
    supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)
      .then(({ data }) => setUsers(data ?? []))
  }, [JSON.stringify(userIds)])

  return users
}
