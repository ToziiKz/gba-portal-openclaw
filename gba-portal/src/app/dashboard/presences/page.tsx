import type { Metadata } from 'next'

import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'
import { PresencesView, type PresenceSession } from '@/components/dashboard/presences/PresencesView'

export const metadata: Metadata = {
  title: 'Présences · ESPACE GBA',
  robots: { index: false, follow: false },
}

export default async function PresencesPage() {
  const supabase = await createClient()

  const scope = await getDashboardScope()

  let query = supabase.from('planning_sessions').select(
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

  if (scope.role === 'coach') {
    if (scope.viewableTeamIds && scope.viewableTeamIds.length > 0) {
      query = query.in('team_id', scope.viewableTeamIds)
    } else {
      query = query.eq('team_id', '__none__')
    }
  }

  const { data: sessions } = await query

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-400">Module</p>
        <h2 className="mt-2 font-[var(--font-teko)] text-4xl font-black uppercase tracking-[0.04em] text-slate-900">
          Présences
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Pointage rapide des séances avec vue coach-first, filtres clairs et accès direct à la feuille.
        </p>
      </div>

      <PresencesView sessions={(sessions ?? []) as unknown as PresenceSession[]} />
    </div>
  )
}
