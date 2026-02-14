import { createClient } from '@/lib/supabase/server'

export type DashboardScope = {
  role: 'viewer' | 'coach' | 'staff' | 'admin'
  editableTeamIds: string[]
  assignedTeams: { id: string; name: string; category: string }[]
  viewableTeamIds: string[] | null
  viewablePoles: string[] | null
}

type TeamRow = {
  id: string
  name: string
  category: string
  pole: string | null
}

type MembershipRow = { team_id: string | null }

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export async function getDashboardScope(): Promise<DashboardScope> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      role: 'viewer',
      editableTeamIds: [],
      assignedTeams: [],
      viewableTeamIds: [],
      viewablePoles: [],
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (profile?.is_active === false) {
    return {
      role: 'viewer',
      editableTeamIds: [],
      assignedTeams: [],
      viewableTeamIds: [],
      viewablePoles: [],
    }
  }

  const rawRole = String(profile?.role ?? 'viewer').trim().toLowerCase()
  const dbRole: DashboardScope['role'] =
    rawRole === 'admin' || rawRole === 'staff' || rawRole === 'coach' || rawRole === 'viewer'
      ? rawRole
      : 'viewer'

  // Primary source: teams where coach_id = current user
  const { data: directTeams } = await supabase
    .from('teams')
    .select('id, name, category, pole')
    .eq('coach_id', user.id)

  // Legacy fallback: staff_team_memberships, kept for backward compatibility
  const { data: memberships } = await supabase
    .from('staff_team_memberships')
    .select('team_id')
    .eq('user_id', user.id)

  const membershipTeamIds = uniq((memberships as MembershipRow[] | null | undefined ?? [])
    .map((m) => (m.team_id ? String(m.team_id) : null))
    .filter((v): v is string => Boolean(v)))

  let mergedTeams: TeamRow[] = (directTeams as TeamRow[] | null) ?? []

  if (membershipTeamIds.length > 0) {
    const existingIds = new Set(mergedTeams.map((t) => String(t.id)))
    const missingIds = membershipTeamIds.filter((id) => !existingIds.has(id))

    if (missingIds.length > 0) {
      const { data: extraTeams } = await supabase
        .from('teams')
        .select('id, name, category, pole')
        .in('id', missingIds)

      mergedTeams = [...mergedTeams, ...(((extraTeams as TeamRow[] | null) ?? []))]
    }
  }

  const editableTeamIds = uniq(mergedTeams.map((t) => String(t.id)))

  // Admin/staff keep full visibility in current product rules.
  if (dbRole === 'admin' || dbRole === 'staff') {
    return { role: dbRole, editableTeamIds: [], assignedTeams: [], viewableTeamIds: null, viewablePoles: null }
  }

  // Defensive fallback: if DB role is viewer but teams are linked, treat as coach scope.
  const role: DashboardScope['role'] = dbRole === 'coach' || editableTeamIds.length > 0 ? 'coach' : 'viewer'

  if (editableTeamIds.length === 0) {
    return { role, editableTeamIds: [], assignedTeams: [], viewableTeamIds: [], viewablePoles: [] }
  }

  const assignedTeams = mergedTeams.map((t) => ({
    id: String(t.id),
    name: t.name,
    category: t.category,
  }))

  // Coach can view/manage only assigned teams (strict mode), not whole pole.
  return {
    role,
    editableTeamIds,
    assignedTeams,
    viewableTeamIds: editableTeamIds,
    viewablePoles: [],
  }
}
