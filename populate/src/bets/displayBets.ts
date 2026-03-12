import { supabase } from '../supabase'

async function displayBets() {
  const { data: bets, error: betsError } = await supabase
    .from('bets_with_profiles')
    .select('user_display_name, bet_team_a, bet_team_b, points_won, match_id')

  if (betsError) throw betsError

  const matchIds = [...new Set(bets.map(b => b.match_id).filter(Boolean))]

  const { data: matches, error: matchError } = await supabase
    .from('matches_with_teams')
    .select('id, team_a_name, team_b_name, score_a, score_b')
    .in('id', matchIds)

  if (matchError) throw matchError

  const matchMap = new Map(matches.map(m => [m.id, m]))

  const table = bets.map(bet => {
    const match = matchMap.get(bet.match_id!)
    return {
      user: bet.user_display_name,
      teamA: match?.team_a_name,
      bet: `${bet.bet_team_a} - ${bet.bet_team_b}`,
      teamB: match?.team_b_name,
      realScore: match?.score_a != null ? `${match.score_a} - ${match.score_b}` : 'not played',
      pointsWon: bet.points_won,
    }
  })

  console.table(table)
}

displayBets()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
