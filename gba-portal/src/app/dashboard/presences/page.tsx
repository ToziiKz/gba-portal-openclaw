import type { Metadata } from 'next'

import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'
import { PresencesView, type PresenceSession } from '@/components/dashboard/presences/PresencesView'

export const metadata: Metadata = {
  title: 'Présences · GBA Dashboard',
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
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Présences
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Gestion des présences par séance (données réelles).
        </p>
      </div>

      <PresencesView sessions={(sessions ?? []) as unknown as PresenceSession[]} />
    </div>
  )
}
