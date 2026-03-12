import { supabase } from '../supabase'

async function whoHaveNoWinner() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .is('winner_team', null)

  if (error) throw error

  console.table(data)
}

whoHaveNoWinner()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
