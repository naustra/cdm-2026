import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Opponent {
  id: string
  display_name: string | null
  avatar_url: string | null
  score: number | null
  winner_team: string | null
}

export function useOpponents(userIds: string[] | undefined): Opponent[] {
  const [opponents, setOpponents] = useState<Opponent[]>([])

  useEffect(() => {
    if (!userIds?.length) return
    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, score, winner_team')
      .in('id', userIds)
      .then(({ data }) => setOpponents(data ?? []))
  }, [JSON.stringify(userIds)])

  return opponents
}

export function useAllOpponents(): Opponent[] {
  const [opponents, setOpponents] = useState<Opponent[]>([])

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, score, winner_team')
      .then(({ data }) => setOpponents(data ?? []))
  }, [])

  return opponents
}

export function useOpponent(userId: string | undefined): Opponent | null {
  const [opponent, setOpponent] = useState<Opponent | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('profiles')
      .select('id, display_name, avatar_url, score, winner_team')
      .eq('id', userId)
      .single()
      .then(({ data }) => setOpponent(data))
  }, [userId])

  return opponent
}
