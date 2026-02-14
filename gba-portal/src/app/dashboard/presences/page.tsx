import type { Metadata } from 'next'

import { createClient } from '@/lib/supabase/server'
import { PresencesView, type PresenceSession } from '@/components/dashboard/presences/PresencesView'

export const metadata: Metadata = {
  title: 'Présences · GBA Dashboard',
  robots: { index: false, follow: false },
}

export default async function PresencesPage() {
  const supabase = await createClient()

  // Everyone can browse all sessions, but the UI will default-focus coaches on their teams.
  const { data: sessions } = await supabase
    .from('planning_sessions')
    .select(
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
