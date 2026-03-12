import { supabase } from '../supabase'

async function checkScores() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, score')

  if (profilesError) throw profilesError

  for (const profile of profiles) {
    const { data: bets, error: betsError } = await supabase
      .from('bets')
      .select('points_won')
      .eq('user_id', profile.id)

    if (betsError) throw betsError

    const betScore = bets.reduce((acc, bet) => {
      if (bet.points_won != null && !isNaN(bet.points_won)) {
        return acc + Math.round(bet.points_won)
      }
      return acc
    }, 0)

    if (Math.abs((profile.score ?? 0) - betScore) > 0.01) {
      console.log(
        `Mismatch: ${profile.display_name} — profile.score=${profile.score}, sum(bets)=${betScore}`,
      )
    }
  }

  console.log('Check complete.')
}

checkScores()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
