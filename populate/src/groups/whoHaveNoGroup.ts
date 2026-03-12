import { supabase } from '../supabase'

async function whoHaveNoGroup() {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name')

  if (profilesError) throw profilesError

  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('members')

  if (groupsError) throw groupsError

  const allMembers = new Set(groups.flatMap(g => g.members ?? []))

  const lonely = profiles
    .filter(p => !allMembers.has(p.id))
    .map(p => ({ user: p.display_name }))

  console.table(lonely)
}

whoHaveNoGroup()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
