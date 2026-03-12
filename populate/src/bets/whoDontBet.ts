import { supabase } from '../supabase'

async function whoDontBet() {
  const { data: matches, error: matchError } = await supabase
    .from('matches_with_teams')
    .select('id, team_a_name, team_b_name')
    .not('team_a', 'is', null)
    .not('team_b', 'is', null)

  if (matchError) throw matchError

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')

  if (profilesError) throw profilesError

  const { data: bets, error: betsError } = await supabase
    .from('bets')
    .select('user_id, match_id')

  if (betsError) throw betsError

  const betSet = new Set(bets.map(b => `${b.match_id}_${b.user_id}`))

  const missing: { user: string; teamA: string; teamB: string; matchId: string }[] = []

  for (const match of matches) {
    for (const profile of profiles) {
      if (!betSet.has(`${match.id}_${profile.id}`)) {
        missing.push({
          user: profile.display_name!,
          teamA: match.team_a_name!,
          teamB: match.team_b_name!,
          matchId: match.id!,
        })
      }
    }
  }

  console.table(missing)
}

whoDontBet()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
