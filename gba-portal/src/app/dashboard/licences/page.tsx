import { Suspense } from 'react'
import { getLicences } from './actions'
import { LicencesClient } from './LicencesClient'
import { Card } from '@/components/ui/Card'

export default async function DashboardLicencesPage() {
  const licences = await getLicences()

  return (
    <Suspense fallback={<LicencesLoading />}>
      <LicencesClient initialRows={licences} />
    </Suspense>
  )
}

function LicencesLoading() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Licences & paiements</h2>
        <p className="text-sm text-white/65">Chargement des licences…</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="premium-card card-shell rounded-3xl p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-white/10" />
          </Card>
        ))}
      </div>

      <Card className="premium-card card-shell rounded-3xl p-0">
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Joueurs</h3>
        </div>
        <div className="grid gap-3 px-4 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
