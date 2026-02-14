import { createClient } from '@/lib/supabase/server'
import { PlanningView, type Session, type TeamOption } from '@/components/dashboard/planning/PlanningView'

export const metadata = {
  title: 'Planning · GBA Dashboard',
}

export default async function PlanningPage() {
  const supabase = await createClient()

  // Planning is a club-wide reference: everyone can see all sessions.
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

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, category, pole')
    .order('category')

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Planning
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Planning réel (Supabase) : création/suppression + vue semaine.
        </p>
      </div>

      <PlanningView
        sessions={(sessions ?? []) as unknown as Session[]}
        teams={(teams ?? []) as unknown as TeamOption[]}
      />
    </div>
  )
}