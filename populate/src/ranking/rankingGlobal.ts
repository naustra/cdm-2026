import { supabase } from '../supabase'

async function rankingGlobal() {
  const { data, error } = await supabase
    .from('ranking')
    .select('rank, display_name, score, winner_team_name')
    .order('rank', { ascending: true })

  if (error) throw error

  console.table(data)
}

rankingGlobal()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
