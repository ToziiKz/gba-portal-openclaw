import type { Metadata } from 'next'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { getDashboardScope } from '@/lib/dashboard/getDashboardScope'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

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

type SessionRow = {
  id: string
  day: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  team: { id: string; name: string } | null
}

type SessionQueryRow = {
  id: string
  day: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  team: { id: string; name: string } | { id: string; name: string }[] | null
}

const weekdayOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default async function DashboardPage() {
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

  const normalizedSessions: SessionRow[] = ((sessions ?? []) as SessionQueryRow[]).map((row) => ({
    id: String(row.id),
    day: row.day ?? null,
    start_time: row.start_time ?? null,
    end_time: row.end_time ?? null,
    location: row.location ?? null,
    team: Array.isArray(row.team) ? (row.team[0] ?? null) : row.team,
  }))

  const orderedSessions = normalizedSessions.slice().sort((a, b) => {
      const ai = weekdayOrder.indexOf(a.day ?? '')
      const bi = weekdayOrder.indexOf(b.day ?? '')
      if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      return String(a.start_time ?? '').localeCompare(String(b.start_time ?? ''))
    })

  const topStats = [
    { label: scope.role === 'coach' ? 'Mes équipes' : 'Équipes', value: teamCount ?? '—', href: '/dashboard/equipes' },
    { label: scope.role === 'coach' ? 'Mes joueurs' : 'Joueurs', value: playerCount ?? '—', href: scope.role === 'coach' ? '/dashboard/effectif' : '/dashboard/joueurs' },
    { label: 'Séances', value: sessionsCount ?? '—', href: '/dashboard/planning' },
  ]

  const quickActions =
    scope.role === 'coach'
      ? [
          { href: '/dashboard/presences', label: 'Pointer les présences' },
          { href: '/dashboard/planning', label: 'Voir le planning' },
          { href: '/dashboard/effectif', label: 'Voir mon effectif' },
          { href: '/dashboard/match', label: 'Préparer un match' },
        ]
      : [
          { href: '/dashboard/convocations', label: 'Ouvrir les convocations' },
          { href: '/dashboard/tactique', label: 'Composition' },
          { href: '/dashboard/planning', label: 'Piloter le planning' },
        ]

  const nextSession = orderedSessions[0] ?? null

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/60">
          {scope.role === 'coach' ? 'Coach center' : 'Command center'}
        </p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          {scope.role === 'coach' ? 'Tableau coach' : 'Vue d’ensemble'}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          {scope.role === 'coach'
            ? 'Vue terrain rapide : équipes, séances, présences et effectif utile.'
            : 'Planning, effectif et outils staff.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
          <CardTitle>{scope.role === 'coach' ? 'Mes prochaines séances' : 'Cette semaine'}</CardTitle>
          <CardDescription>
            {scope.role === 'coach'
              ? 'Uniquement les séances de tes équipes assignées.'
              : 'Les séances enregistrées dans le planning.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {nextSession ? (
            <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/80">Prochain créneau</p>
              <p className="mt-1 text-sm font-bold text-emerald-100">
                {nextSession.day ?? '—'} • {nextSession.start_time ?? '—'}–{nextSession.end_time ?? '—'} • {nextSession.team?.name ?? '—'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/dashboard/presences">
                  <Button size="sm">Pointer présences</Button>
                </Link>
                <Link href="/dashboard/match">
                  <Button size="sm" variant="secondary">Préparer un match</Button>
                </Link>
              </div>
            </div>
          ) : null}

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
              {orderedSessions.slice(0, 8).map((s) => (
                <li key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {s.day ?? '—'} • {s.start_time ?? '—'}–{s.end_time ?? '—'} • {s.team?.name ?? '—'}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">{s.location ?? '—'}</p>
                    </div>
                    <Link href="/dashboard/presences">
                      <Button size="sm" variant="secondary">
                        Présences
                      </Button>
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
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            {scope.role === 'coach' ? 'Les 3 actions les plus utiles en bord de terrain.' : 'Raccourcis opérationnels staff.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button>{action.label}</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
