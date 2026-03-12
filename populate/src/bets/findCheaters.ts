import { supabase } from '../supabase'

async function findCheaters() {
  const { data: bets, error: betsError } = await supabase
    .from('bets')
    .select('user_id, match_id, points_won, updated_at')
    .not('updated_at', 'is', null)

  if (betsError) throw betsError

  const matchIds = [...new Set(bets.map(b => b.match_id).filter(Boolean))]

  const { data: matches, error: matchError } = await supabase
    .from('matches')
    .select('id, date_time')
    .in('id', matchIds as string[])

  if (matchError) throw matchError

  const matchMap = new Map(matches.map(m => [m.id, m.date_time]))

  const cheaters: { userId: string; matchId: string; pointsWon: number | null; delay: string }[] = []

  for (const bet of bets) {
    const matchDateTime = matchMap.get(bet.match_id!)
    if (!matchDateTime || !bet.updated_at) continue

    if (new Date(bet.updated_at) > new Date(matchDateTime)) {
      const diffMinutes = Math.round(
        (new Date(bet.updated_at).getTime() - new Date(matchDateTime).getTime()) / 60000,
      )
      cheaters.push({
        userId: bet.user_id!,
        matchId: bet.match_id!,
        pointsWon: bet.points_won,
        delay: `+${diffMinutes} minutes`,
      })
    }
  }

  if (cheaters.length === 0) {
    console.log('No cheaters found.')
    return
  }

  const userIds = [...new Set(cheaters.map(c => c.userId))]
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds)

  if (profilesError) throw profilesError

  const profileMap = new Map(profiles.map(p => [p.id, p.display_name]))

  const enriched = cheaters.map(c => ({
    user: profileMap.get(c.userId) ?? c.userId,
    matchId: c.matchId,
    pointsWon: c.pointsWon,
    delay: c.delay,
  }))

  console.table(enriched)
}

findCheaters()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
