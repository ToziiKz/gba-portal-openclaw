import { createClient } from '@/lib/supabase/server'
import { TeamsView, type TeamWithCoach } from '@/components/dashboard/teams/TeamsView'
import type { DashboardRole } from '@/lib/dashboardRole'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'

export const metadata = {
  title: 'Équipes · GBA Dashboard',
}

function toDashboardRole(role: string | null | undefined): DashboardRole {
  if (role === 'admin' || role === 'staff' || role === 'coach' || role === 'viewer') return role
  return 'viewer'
}

export default async function TeamsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: { role?: string | null } | null = null
  if (user) {
    const result = await supabase.from('profiles').select('role').eq('id', user.id).single()
    profile = result.data
  }

  const role = toDashboardRole(profile?.role)

  const scope = await getDashboardScope()

  let query = supabase
    .from('teams')
    .select(
      `
      id,
      name,
      category,
      pole,
      gender,
      coach_id,
      coach:coach_id(full_name),
      players(count)
    `
    )
    .order('name')

  // Non-admin/staff are restricted to their viewable scope.
  if (scope.role !== 'admin' && scope.role !== 'staff') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      query = query.in('id', scope.viewableTeamIds)
    } else {
      query = query.eq('id', '__none__')
    }
  }

  const { data: teams } = await query

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Équipes
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          {role === 'admin'
            ? "Gestion des équipes (structure fixe) et affectation des coachs."
            : role === 'coach'
              ? 'Toutes les équipes de votre pôle.'
              : "Accès lecture."}
        </p>
      </div>

      <TeamsView
        role={role}
        initialTeams={(teams ?? []) as unknown as TeamWithCoach[]}
      />
    </div>
  )
}
