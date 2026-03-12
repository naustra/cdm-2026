import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Tables } from '../lib/database.types'

type MatchWithTeamsRow = Tables<'matches_with_teams'>

export interface NormalizedMatch {
  id: string
  dateTime: { seconds: number } | null
  ville: string | null
  teamA: string | null
  teamB: string | null
  teamAName: string | null
  teamACode: string | null
  teamBName: string | null
  teamBCode: string | null
  streaming: string | null
  scores: { A: number | null; B: number | null }
  odds: { PA: number | null; PB: number | null; PN: number | null }
  phase: string | null
  finished: boolean | null
  display: boolean
  idApiRugby: string | null
}

function normalizeMatch(row: MatchWithTeamsRow): NormalizedMatch {
  return {
    id: row.id!,
    dateTime: row.date_time
      ? { seconds: new Date(row.date_time).getTime() / 1000 }
      : null,
    ville: row.city,
    teamA: row.team_a,
    teamB: row.team_b,
    teamAName: row.team_a_name ?? null,
    teamACode: row.team_a_code ?? null,
    teamBName: row.team_b_name ?? null,
    teamBCode: row.team_b_code ?? null,
    streaming: row.streaming,
    scores: { A: row.score_a, B: row.score_b },
    odds: { PA: row.odds_a, PB: row.odds_b, PN: row.odds_draw },
    phase: row.phase,
    finished: row.finished,
    display: true,
    idApiRugby: row.api_id,
  }
}

export function useMatches(): NormalizedMatch[] | null {
  const [matches, setMatches] = useState<NormalizedMatch[] | null>(null)

  useEffect(() => {
    supabase
      .from('matches_with_teams')
      .select('*')
      .order('date_time', { ascending: true })
      .then(({ data }) => {
        const normalized = data?.map(normalizeMatch)
        setMatches(normalized ?? null)
      })
  }, [])

  return matches
}

export function useMatch(matchId: string | undefined): NormalizedMatch | null {
  const [match, setMatch] = useState<NormalizedMatch | null>(null)

  useEffect(() => {
    if (!matchId) return
    supabase
      .from('matches_with_teams')
      .select('*')
      .eq('id', matchId)
      .single()
      .then(({ data }) => setMatch(data ? normalizeMatch(data) : null))
  }, [matchId])

  return match
}
