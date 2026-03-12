import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useUserProfile, useUpdateProfile } from './user'

export function useSelectedWinner(): [string | null | undefined, (team: string) => Promise<void>] {
  const profile = useUserProfile()
  const updateProfile = useUpdateProfile()

  const updater = useCallback(
    async (team: string) => {
      if (!profile?.id) return
      const { error } = await supabase
        .from('profiles')
        .update({ winner_team: team })
        .eq('id', profile.id)

      if (error) {
        toast.error('Mise à jour échouée :(')
        return
      }
      updateProfile({ winner_team: team })
      toast.success('Équipe mise à jour')
    },
    [profile?.id, updateProfile],
  )

  return [profile?.winner_team, updater]
}
