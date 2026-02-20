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

  // Source of truth: only teams where coach_id = current user.
  // Legacy memberships are intentionally ignored to prevent stale cross-team visibility.
  const mergedTeams: TeamRow[] = (directTeams as TeamRow[] | null) ?? []

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
