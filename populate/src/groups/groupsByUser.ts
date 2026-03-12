import { supabase } from '../supabase'

async function groupsByUser() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')

  if (profilesError) throw profilesError

  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('name, members')

  if (groupsError) throw groupsError

  const table = profiles.map(profile => {
    const userGroups = groups
      .filter(g => (g.members ?? []).includes(profile.id))
      .map(g => g.name)

    return {
      user: profile.display_name,
      groups: userGroups.join(', ') || '—',
    }
  })

  console.table(table)
}

groupsByUser()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
