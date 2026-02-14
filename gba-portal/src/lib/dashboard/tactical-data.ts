import { createClient } from '@/lib/supabase/client'

type Team = {
  id: string
  name: string
  category: string
  pole?: string | null
}

type PlayerDb = {
  id: string
  firstname: string | null
  lastname: string | null
  category: string | null
}

export async function fetchVisibleTacticalTeams(includePoleTeams: boolean) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const userId = authData.user?.id

  if (!userId) {
    const { data } = await supabase.from('teams').select('id, name, category, pole').order('name')
    return { isCoach: false, teams: ((data ?? []) as Team[]) }
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
  const role = String(profile?.role ?? '').trim().toLowerCase()

  if (role !== 'coach') {
    const { data } = await supabase.from('teams').select('id, name, category, pole').order('name')
    return { isCoach: false, teams: ((data ?? []) as Team[]) }
  }

  const { data: ownTeamsData } = await supabase
    .from('teams')
    .select('id, name, category, pole')
    .eq('coach_id', userId)
    .order('name')

  const ownTeams = (ownTeamsData ?? []) as Team[]
  let visibleTeams = ownTeams

  if (includePoleTeams) {
    const poles = Array.from(new Set(ownTeams.map((t) => t.pole).filter(Boolean))) as string[]
    if (poles.length > 0) {
      const { data: poleTeamsData } = await supabase
        .from('teams')
        .select('id, name, category, pole')
        .in('pole', poles)
        .order('name')

      const merged = [...ownTeams, ...((poleTeamsData ?? []) as Team[])]
      const byId = new Map(merged.map((t) => [t.id, t]))
      visibleTeams = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  return { isCoach: true, teams: visibleTeams }
}

export async function fetchPlayersByTeam(teamId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('players')
    .select('id, firstname, lastname, category')
    .eq('team_id', teamId)
    .order('lastname')

  return ((data ?? []) as PlayerDb[]).map((p) => ({
    id: String(p.id),
    name: `${p.firstname ?? ''} ${(p.lastname ?? '').slice(0, 1)}.`.trim(),
    category: p.category ?? '',
  }))
}
