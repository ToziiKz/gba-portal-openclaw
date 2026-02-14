'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { RosterChecklist } from '@/components/dashboard/RosterChecklist'
import { useDashboardScope } from '@/components/dashboard/DashboardScopeProvider'

const planningDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const

type PlanningDay = (typeof planningDays)[number]

export type PresenceSession = {
  id: string
  day: PlanningDay
  pole: string
  start_time: string
  end_time: string
  location: string
  staff: string[]
  note: string | null
  team: { id: string; name: string; category: string } | null
}

type Props = {
  sessions: PresenceSession[]
}

function sessionTimeLabel(s: PresenceSession) {
  return `${s.start_time}–${s.end_time}`
}

function groupByDay(sessions: PresenceSession[]) {
  const map = new Map<PlanningDay, PresenceSession[]>()
  for (const day of planningDays) map.set(day, [])
  for (const s of sessions) map.get(s.day)?.push(s)
  for (const day of planningDays) {
    const items = map.get(day)
    if (!items) continue
    items.sort((a, b) => a.start_time.localeCompare(b.start_time))
  }
  return map
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

export function PresencesView({ sessions }: Props) {
  const scope = useDashboardScope()

  const [viewMode, setViewMode] = React.useState<'my' | 'club'>(() => (scope.role === 'coach' ? 'my' : 'club'))
  const [pole, setPole] = React.useState<string | 'all'>('all')
  const [teamId, setTeamId] = React.useState<string | 'all'>('all')
  const [query, setQuery] = React.useState('')
  const [selectedSession, setSelectedSession] = React.useState<PresenceSession | null>(null)

  const coachTeamIds = scope.role === 'coach' ? scope.editableTeamIds : []

  // Default focus: coach → first of their teams when possible
  React.useEffect(() => {
    if (scope.role !== 'coach') return
    if (teamId !== 'all') return
    if (coachTeamIds.length === 0) return
    setTeamId(coachTeamIds[0])
  }, [scope.role, coachTeamIds, teamId])

  const poles = React.useMemo(() => Array.from(new Set(sessions.map((s) => s.pole))).sort(), [sessions])

  const teamOptions = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string }>()
    for (const s of sessions) {
      const t = s.team
      if (!t) continue
      map.set(t.id, t)
    }
    return Array.from(map.values()).sort((a, b) => `${a.category} ${a.name}`.localeCompare(`${b.category} ${b.name}`))
  }, [sessions])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()

    return sessions
      .filter((s) => {
        // View mode
        if (viewMode === 'club') return true
        if (scope.role !== 'coach') return true
        const tid = s.team?.id
        return tid ? coachTeamIds.includes(tid) : false
      })
      .filter((s) => (pole === 'all' ? true : s.pole === pole))
      .filter((s) => {
        if (teamId === 'all') return true
        return s.team?.id === teamId
      })
      .filter((s) => {
        if (!q) return true
        const hay = `${s.team?.name ?? ''} ${s.team?.category ?? ''} ${s.location} ${s.staff.join(' ')} ${s.note ?? ''}`
          .toLowerCase()
        return hay.includes(q)
      })
  }, [sessions, scope.role, viewMode, pole, teamId, query, coachTeamIds])

  const sessionsByDay = React.useMemo(() => groupByDay(filtered), [filtered])

  const myNextSessions = React.useMemo(() => {
    // "Next" in a fixed weekly planning: day order + start time.
    if (scope.role !== 'coach') return [] as PresenceSession[]

    const mine = sessions
      .filter((s) => {
        const tid = s.team?.id
        return tid ? coachTeamIds.includes(tid) : false
      })
      .slice()
      .sort((a, b) => {
        const ar = planningDays.indexOf(a.day)
        const br = planningDays.indexOf(b.day)
        if (ar !== br) return ar - br
        return a.start_time.localeCompare(b.start_time)
      })

    return mine.slice(0, 4)
  }, [scope.role, sessions, coachTeamIds])

  return (
    <div className="grid gap-6">
      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Accès rapide</CardTitle>
          <CardDescription>
            {scope.role === 'coach'
              ? 'Par défaut : vos équipes. Vous pouvez basculer sur le planning club si besoin.'
              : 'Filtrer et retrouver une séance rapidement.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scope.role === 'coach' ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'my' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('my')}
                >
                  Mes équipes
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'club' ? 'primary' : 'secondary'}
                  onClick={() => setViewMode('club')}
                >
                  Tout le club
                </Button>
              </div>

              <p className="text-sm text-white/60">
                {viewMode === 'my' ? 'Focus équipes coachées' : 'Vue club'} • {filtered.length} séance(s)
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/60">{filtered.length} séance(s)</p>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Équipe</span>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className={inputBaseClassName()}>
                <option value="all">Toutes</option>
                {teamOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.category} • {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select value={pole} onChange={(e) => setPole(e.target.value)} className={inputBaseClassName()}>
                <option value="all">Tous</option>
                {poles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recherche</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U13, Synthétique…"
                className={inputBaseClassName()}
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-white/60">{filtered.length} séance(s)</p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (scope.role === 'coach') setViewMode('my')
                setPole('all')
                setTeamId('all')
                setQuery('')
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {scope.role === 'coach' ? (
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Mes prochaines séances</CardTitle>
            <CardDescription>Accès direct à l’appel (1 clic).</CardDescription>
          </CardHeader>
          <CardContent>
            {myNextSessions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune séance pour vos équipes</p>
                <p className="mt-1 text-sm text-white/65">Passez en “Tout le club” pour explorer le planning.</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {myNextSessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSession(s)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/8 hover:border-white/20 active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{s.team?.name ?? '—'}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                          {s.day} • {sessionTimeLabel(s)} • {s.location}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                        Ouvrir
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Semaine</CardTitle>
          <CardDescription>Clique sur une séance pour gérer la feuille de présence.</CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Aucune séance</p>
              <p className="mt-1 text-sm text-white/65">Ajoute une séance dans le planning pour démarrer.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-7">
              {planningDays.map((day) => {
                const items = sessionsByDay.get(day) ?? []
                return (
                  <section key={day} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <header className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">{day}</p>
                      <p className="text-xs text-white/45">{items.length}</p>
                    </header>

                    {items.length === 0 ? (
                      <p className="mt-3 text-xs text-white/35">—</p>
                    ) : (
                      <ul className="mt-3 grid gap-2">
                        {items.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedSession(s)}
                              className="w-full text-left rounded-xl border border-white/10 bg-black/20 p-3 transition hover:bg-white/5 hover:border-white/20 active:scale-[0.98]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">{s.team?.name ?? '—'}</p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">{s.pole}</p>
                                </div>
                                <span className="shrink-0 rounded-full border border-white/15 bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                                  {sessionTimeLabel(s)}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-white/60">{s.location}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={selectedSession ? `Présences — ${selectedSession.team?.name ?? ''}` : ''}
        description={selectedSession ? `${selectedSession.day} • ${sessionTimeLabel(selectedSession)}` : ''}
      >
        {selectedSession?.team ? (
          <RosterChecklist
            sessionId={selectedSession.id}
            teamId={selectedSession.team.id}
            teamLabel={`${selectedSession.team.category} • ${selectedSession.team.name}`}
            onBack={() => setSelectedSession(null)}
            onClose={() => setSelectedSession(null)}
          />
        ) : (
          <p className="text-sm text-white/60">Aucune équipe liée à cette séance.</p>
        )}
      </Modal>
    </div>
  )
}
