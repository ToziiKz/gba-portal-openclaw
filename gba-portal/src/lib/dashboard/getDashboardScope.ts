import { createClient } from '@/lib/supabase/server'

export type DashboardScope = {
  role: 'viewer' | 'coach' | 'staff' | 'admin'
  // Teams the user can edit (coach memberships)
  editableTeamIds: string[]
  // Teams assigned to the user (display + default focus)
  assignedTeams: { id: string; name: string; category: string }[]
  // Teams the user can view (pole-wide for coach)
  viewableTeamIds: string[] | null
  viewablePoles: string[] | null
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

/**
 * Server helper: compute what the current user can see/edit.
 *
 * Rules (current):
 * - admin/staff: view all
 * - coach: can view all teams in the pole(s) of their membership team(s)
 *         can edit only teams they are explicitly member of
 */
export async function getDashboardScope() : Promise<DashboardScope> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { role: 'viewer', editableTeamIds: [], assignedTeams: [], viewableTeamIds: [], viewablePoles: [] }
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = (profile?.role as DashboardScope['role']) ?? 'viewer'

  if (role !== 'coach') {
    return { role, editableTeamIds: [], assignedTeams: [], viewableTeamIds: null, viewablePoles: null }
  }

  // Membership teams (editable)
  const { data: memberships } = await supabase
    .from('staff_team_memberships')
    .select('team_id')
    .eq('user_id', user.id)

  const editableTeamIds = uniq((memberships ?? []).map((m: any) => String(m.team_id)))
  if (editableTeamIds.length === 0) {
    return { role, editableTeamIds: [], assignedTeams: [], viewableTeamIds: [], viewablePoles: [] }
  }

  // Poles + details of membership teams
  const { data: myTeams } = await supabase
    .from('teams')
    .select('id, name, category, pole')
    .in('id', editableTeamIds)

  const assignedTeams = (myTeams ?? []).map((t: any) => ({
    id: String(t.id),
    name: t.name,
    category: t.category,
  }))

  const viewablePoles = uniq((myTeams ?? []).map((t: any) => t.pole).filter(Boolean)) as string[]

  if (viewablePoles.length === 0) {
    // Fallback: can only see own teams
    return { role, editableTeamIds, assignedTeams, viewableTeamIds: editableTeamIds, viewablePoles: [] }
  }

  // All teams in these poles
  const { data: poleTeams } = await supabase
    .from('teams')
    .select('id')
    .in('pole', viewablePoles)

  const viewableTeamIds = uniq((poleTeams ?? []).map((t: any) => String(t.id)))

  return { role, editableTeamIds, assignedTeams, viewableTeamIds, viewablePoles }
}
