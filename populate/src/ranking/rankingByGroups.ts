import { supabase } from '../supabase'

async function rankingByGroups() {
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('id, name, members')

  if (groupsError) throw groupsError

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, score')

  if (profilesError) throw profilesError

  const profileMap = new Map(profiles.map(p => [p.id, p]))

  for (const group of groups) {
    console.log(`\n=== ${group.name} ===`)

    const members = (group.members ?? [])
      .map(uid => profileMap.get(uid))
      .filter(Boolean)
      .sort((a, b) => (b!.score ?? 0) - (a!.score ?? 0))
      .map(p => ({ name: p!.display_name, score: p!.score }))

    console.table(members)
  }
}

rankingByGroups()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
