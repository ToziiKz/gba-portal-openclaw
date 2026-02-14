import type { Metadata } from 'next'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DashboardHero } from '@/components/dashboard/DashboardHero'

export const metadata: Metadata = {
  title: 'Dashboard · GBA',
  description: 'Espace staff : planning, effectif, présences, convocations.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/dashboard',
  },
}

const weekdayOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: teamCount }, { count: playerCount }, { count: sessionsCount }] = await Promise.all([
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true }),
    supabase.from('planning_sessions').select('*', { count: 'exact', head: true }),
  ])

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

  const orderedSessions = (sessions ?? []).slice().sort((a: any, b: any) => {
    const ai = weekdayOrder.indexOf(a.day)
    const bi = weekdayOrder.indexOf(b.day)
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return String(a.start_time ?? '').localeCompare(String(b.start_time ?? ''))
  })

  const topStats = [
    { label: 'Équipes', value: teamCount ?? '—', href: '/dashboard/equipes' },
    { label: 'Joueurs', value: playerCount ?? '—', href: '/dashboard/joueurs' },
    { label: 'Séances', value: sessionsCount ?? '—', href: '/dashboard/planning' },
    { label: 'Tactique', value: '✓', href: '/dashboard/tactique' },
  ]

  return (
    <div className="grid gap-6">
      <DashboardHero />

      <div>
        <p className="text-xs uppercase tracking-widest text-white/60">Command center</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Vue d’ensemble
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Planning, effectif et outils staff. Zéro contenu “mock” affiché.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {topStats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ui-ring)]"
          >
            <Card className="premium-card card-shell rounded-3xl transition">
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-widest text-[color:var(--ui-muted-2)]">
                  {s.label}
                </CardDescription>
                <CardTitle className="text-3xl font-black tracking-tight text-[color:var(--ui-fg)]">
                  {s.value}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Cette semaine</CardTitle>
          <CardDescription>Les séances enregistrées dans le planning.</CardDescription>
        </CardHeader>
        <CardContent>
          {orderedSessions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Aucune séance</p>
              <p className="mt-1 text-sm text-white/65">Ajoute une séance pour démarrer.</p>
              <div className="mt-4">
                <Link href="/dashboard/planning">
                  <Button size="sm">Ouvrir le planning</Button>
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-3">
              {orderedSessions.slice(0, 10).map((s: any) => (
                <li key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {s.day} • {s.start_time}–{s.end_time} • {s.team?.name ?? '—'}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                        {s.pole} • {s.location}
                      </p>
                    </div>
                    <Link href="/dashboard/planning">
                      <Button size="sm" variant="secondary">Détails</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Convocations</CardTitle>
          <CardDescription>Préparer un match et envoyer un message aux joueurs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/convocations">
              <Button>Ouvrir les convocations</Button>
            </Link>
            <Link href="/dashboard/tactique">
              <Button variant="secondary">Préparer une compo</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
