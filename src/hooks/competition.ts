import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface CompetitionData {
  id: string
  launch_bet: string | null
  start_date: string | null
  launchBet: { seconds: number } | null
}

export function useCompetitionData(): CompetitionData | null {
  const [competition, setCompetition] = useState<CompetitionData | null>(null)

  useEffect(() => {
    supabase
      .from('competitions')
      .select('*')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setCompetition({
            ...data,
            launchBet: data.launch_bet
              ? { seconds: new Date(data.launch_bet).getTime() / 1000 }
              : null,
          })
        }
      })
  }, [])

  return competition
}
