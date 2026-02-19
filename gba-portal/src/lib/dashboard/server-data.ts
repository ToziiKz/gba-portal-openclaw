import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'

type TeamLite = {
  id: string
  name: string
  category: string | null
  pole: string | null
}

type PlayerLite = {
  id: string
  firstname: string | null
  lastname: string | null
  team_id: string | null
}

type SessionLite = {
  id: string
  day: string | null
  session_date?: string | null
  pole: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  staff: string[] | null
  note: string | null
  team: { id: string; name: string; category: string | null } | { id: string; name: string; category: string | null }[] | null
}

function normalizeTeam(value: SessionLite['team']) {
  if (!value) return null
  return Array.isArray(value) ? (value[0] ?? null) : value
}

export async function getScopedRosterData() {
  const supabase = await createClient()
  const scope = await getDashboardScope()

  let teamsQuery = supabase.from('teams').select('id, name, category, pole').order('name')
  let playersQuery = supabase.from('players').select('id, firstname, lastname, team_id').order('lastname')

  if (scope.role !== 'admin' && scope.role !== 'staff') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      teamsQuery = teamsQuery.in('id', scope.viewableTeamIds)
      playersQuery = playersQuery.in('team_id', scope.viewableTeamIds)
    } else {
      teamsQuery = teamsQuery.eq('id', '__none__')
      playersQuery = playersQuery.eq('team_id', '__none__')
    }
  }

  const [{ data: teams }, { data: players }] = await Promise.all([teamsQuery, playersQuery])

  return {
    scope,
    teams: ((teams ?? []) as TeamLite[]).map((t) => ({
      id: String(t.id),
      name: t.name ?? 'Équipe sans nom',
      category: t.category ?? null,
      pole: t.pole ?? null,
    })),
    players: (players ?? []) as PlayerLite[],
  }
}

export async function getScopedPlanningData() {
  const supabase = await createClient()
  const scope = await getDashboardScope()

  let sessionsQuery = supabase.from('planning_sessions').select(
    `
      id,
      day,
      session_date,
      pole,
      start_time,
      end_time,
      location,
      staff,
      note,
      team:team_id (
        id,
        name,
        category
      )
    `
  )

  let teamsQuery = supabase.from('teams').select('id, name, category, pole').order('category')

  if (scope.role !== 'admin' && scope.role !== 'staff') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      sessionsQuery = sessionsQuery.in('team_id', scope.viewableTeamIds)
      teamsQuery = teamsQuery.in('id', scope.viewableTeamIds)
    } else {
      sessionsQuery = sessionsQuery.eq('team_id', '__none__')
      teamsQuery = teamsQuery.eq('id', '__none__')
    }
  }

  let [{ data: sessions, error: sessionsError }, { data: teams }] = await Promise.all([sessionsQuery, teamsQuery])

  // Backward compatibility if session_date column is not deployed yet
  if (sessionsError && (sessionsError.message?.includes('session_date') || sessionsError.code === 'PGRST204')) {
    let legacySessionsQuery = supabase.from('planning_sessions').select(
      `
        id,
        day,
        pole,
        start_time,
        end_time,
        location,
        staff,
        note,
        team:team_id (
          id,
          name,
          category
        )
      `
    )

    if (scope.role !== 'admin' && scope.role !== 'staff') {
      if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
        legacySessionsQuery = legacySessionsQuery.in('team_id', scope.viewableTeamIds)
      } else {
        legacySessionsQuery = legacySessionsQuery.eq('team_id', '__none__')
      }
    }

    const { data: legacySessions } = await legacySessionsQuery
    sessions = legacySessions as typeof sessions
  }

  return {
    scope,
    teams: (teams ?? []) as TeamLite[],
    sessions: ((sessions ?? []) as SessionLite[]).map((s) => ({ ...s, team: normalizeTeam(s.team) })),
  }
}

type HomeSessionRow = {
  id: string
  day: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  team: { id: string; name: string } | { id: string; name: string }[] | null
}

export async function getDashboardHomeData() {
  const supabase = await createClient()
  const scope = await getDashboardScope()

  let teamsCountQuery = supabase.from('teams').select('*', { count: 'exact', head: true })
  let playersCountQuery = supabase.from('players').select('*', { count: 'exact', head: true })
  let sessionsCountQuery = supabase.from('planning_sessions').select('*', { count: 'exact', head: true })

  let sessionsQuery = supabase
    .from('planning_sessions')
    .select(
      `
      id,
      day,
      start_time,
      end_time,
      location,
      team:team_id (
        id,
        name
      )
    `
    )

  if (scope.role === 'coach') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      teamsCountQuery = teamsCountQuery.in('id', scope.viewableTeamIds)
      playersCountQuery = playersCountQuery.in('team_id', scope.viewableTeamIds)
      sessionsCountQuery = sessionsCountQuery.in('team_id', scope.viewableTeamIds)
      sessionsQuery = sessionsQuery.in('team_id', scope.viewableTeamIds)
    } else {
      teamsCountQuery = teamsCountQuery.eq('id', '__none__')
      playersCountQuery = playersCountQuery.eq('team_id', '__none__')
      sessionsCountQuery = sessionsCountQuery.eq('team_id', '__none__')
      sessionsQuery = sessionsQuery.eq('team_id', '__none__')
    }
  }

  const [{ count: teamCount }, { count: playerCount }, { count: sessionsCount }, { data: sessions }] =
    await Promise.all([teamsCountQuery, playersCountQuery, sessionsCountQuery, sessionsQuery])

  const normalizedSessions = ((sessions ?? []) as HomeSessionRow[]).map((row) => ({
    id: String(row.id),
    day: row.day ?? null,
    start_time: row.start_time ?? null,
    end_time: row.end_time ?? null,
    location: row.location ?? null,
    team: Array.isArray(row.team) ? (row.team[0] ?? null) : row.team,
  }))

  return {
    scope,
    teamCount: teamCount ?? 0,
    playerCount: playerCount ?? 0,
    sessionsCount: sessionsCount ?? 0,
    sessions: normalizedSessions,
  }
}
