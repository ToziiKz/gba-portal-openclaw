import { PlanningView, type Session, type TeamOption } from '@/components/dashboard/planning/PlanningView'
import { getScopedPlanningData } from '@/lib/dashboard/server-data'

export const metadata = {
  title: 'Planning · GBA Dashboard',
}

export default async function PlanningPage() {
  const { scope, sessions, teams } = await getScopedPlanningData()

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Planning
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          {scope.role === 'coach'
            ? 'Planning de vos équipes : créneaux, lieux et staff assigné.'
            : 'Planning club : création/suppression + vue semaine.'}
        </p>
      </div>

      <PlanningView
        sessions={(sessions ?? []) as unknown as Session[]}
        teams={(teams ?? []) as unknown as TeamOption[]}
      />
    </div>
  )
}