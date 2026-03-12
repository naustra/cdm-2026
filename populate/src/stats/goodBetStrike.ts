import { supabase } from '../supabase'

async function goodBetStrike() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .gt('score', 0)

  if (profilesError) throw profilesError

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id')
    .not('team_a', 'is', null)
    .not('team_b', 'is', null)
    .order('date_time', { ascending: true })

  if (matchesError) throw matchesError

  const { data: allBets, error: betsError } = await supabase
    .from('bets')
    .select('user_id, match_id, points_won')

  if (betsError) throw betsError

  const betMap = new Map(allBets.map(b => [`${b.match_id}_${b.user_id}`, b.points_won]))

  const results = profiles.map(profile => {
    let strikeMax = 0
    let strike = 0

    for (const match of matches) {
      const pointsWon = betMap.get(`${match.id}_${profile.id}`) ?? 0
      if (pointsWon > 0) {
        strike++
      } else {
        if (strike > strikeMax) strikeMax = strike
        strike = 0
      }
    }
    if (strike > strikeMax) strikeMax = strike

    return { name: profile.display_name, strikeMax }
  })

  console.table(results.sort((a, b) => b.strikeMax - a.strikeMax))
}

goodBetStrike()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
