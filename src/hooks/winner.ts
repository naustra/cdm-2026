import { useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { supabase } from '../lib/supabase'
import { useUserProfile } from './user'

export function useSelectedWinner(): [string | null | undefined, (team: string) => Promise<void>] {
  const profile = useUserProfile()
  const { enqueueSnackbar } = useSnackbar()

  const updater = useCallback(
    async (team: string) => {
      if (!profile?.id) return
      const { error } = await supabase
        .from('profiles')
        .update({ winner_team: team })
        .eq('id', profile.id)

      if (error) {
        enqueueSnackbar('Mise à jour échouée :(', { variant: 'error' })
        return
      }
      enqueueSnackbar('Équipe mise à jour', { variant: 'success' })
    },
    [profile?.id, enqueueSnackbar],
  )

  return [profile?.winner_team, updater]
}
