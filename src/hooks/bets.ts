import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Tables } from '../lib/database.types'

type BetRow = Tables<'bets'>

interface NormalizedBet {
  id: string
  matchId: string | null
  uid: string | null
  betTeamA: number | null
  betTeamB: number | null
  pointsWon: number | null
  updatedAt: string | null
  match_id: string | null
  user_id: string | null
  bet_team_a: number | null
  bet_team_b: number | null
  points_won: number | null
  updated_at: string | null
}

function normalizeBet(row: BetRow | null): NormalizedBet | undefined {
  if (!row) return undefined
  return {
    ...row,
    matchId: row.match_id,
    uid: row.user_id,
    betTeamA: row.bet_team_a,
    betTeamB: row.bet_team_b,
    pointsWon: row.points_won,
    updatedAt: row.updated_at,
  }
}

export function useBetsFromGame(matchId: string | undefined) {
  const [bets, setBets] = useState<NormalizedBet[] | null>(null)

  useEffect(() => {
    if (!matchId) return
    supabase
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
      .then(({ data }) => setBets(data?.map(normalizeBet).filter(Boolean) as NormalizedBet[] ?? null))
  }, [matchId])

  return bets
}

export function useBetFromUser(matchId: string | undefined, uid: string | undefined) {
  const [bet, setBet] = useState<NormalizedBet | null | undefined>(null)

  useEffect(() => {
    if (!matchId || !uid) return
    supabase
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', uid)
      .maybeSingle()
      .then(({ data }) => setBet(normalizeBet(data) ?? null))
  }, [matchId, uid])

  return [bet]
}

export function useBet(matchId: string | undefined) {
  const { user } = useAuth()
  const uid = user?.id
  const [bet, setBetState] = useState<BetRow | null>(null)

  useEffect(() => {
    if (!matchId || !uid) return
    supabase
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', uid)
      .maybeSingle()
      .then(({ data }) => setBetState(data))
  }, [matchId, uid])

  const setBet = useCallback(
    async (betData: { betTeamA: number; betTeamB: number }) => {
      if (!uid) return
      const id = `${matchId}_${uid}`
      const row = {
        id,
        match_id: matchId!,
        user_id: uid,
        bet_team_a: betData.betTeamA,
        bet_team_b: betData.betTeamB,
        updated_at: new Date().toISOString(),
      }
      const { data } = await supabase
        .from('bets')
        .upsert(row, { onConflict: 'id' })
        .select()
        .single()
      if (data) setBetState(data)
    },
    [matchId, uid],
  )

  return [normalizeBet(bet), setBet] as const
}
