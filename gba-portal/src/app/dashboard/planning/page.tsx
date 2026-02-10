'use client'

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { RosterChecklist } from '@/components/dashboard/RosterChecklist'
import { CreateSessionModal } from '@/components/dashboard/CreateSessionModal'
import {
  planningDays,
  planningPoles,
  planningSessionsMock,
  type PlanningDay,
  type PlanningPole,
  type PlanningSession,
} from '@/lib/mocks/dashboardPlanning'

const STORAGE_KEY = 'gba-dashboard-planning-sessions-v1'

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

function sessionTimeLabel(session: PlanningSession) {
  return `${session.start}–${session.end}`
}

function groupByDay(sessions: PlanningSession[]) {
  const map = new Map<PlanningDay, PlanningSession[]>()
  for (const day of planningDays) map.set(day, [])
  for (const s of sessions) map.get(s.day)?.push(s)
  for (const day of planningDays) {
    const items = map.get(day)
    if (!items) continue
    items.sort((a, b) => a.start.localeCompare(b.start))
  }
  return map
}

export default function DashboardPlanningPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [pole, setPole] = React.useState<PlanningPole | 'all'>('all')
  const [query, setQuery] = React.useState('')
  const [selectedSession, setSelectedSession] = React.useState<PlanningSession | null>(null)
  const [view, setView] = React.useState<'details' | 'presence'>('details')

  const [sessions, setSessions] = React.useState<PlanningSession[]>(planningSessionsMock)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (!selectedSession) setView('details')
  }, [selectedSession])

  // Load from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSessions(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load planning sessions', e)
    }
  }, [])

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  React.useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 500)
    return () => window.clearTimeout(t)
  }, [])

  const handleCreateSession = (newSession: Omit<PlanningSession, 'id' | 'updatedAtLabel'>) => {
    const session: PlanningSession = {
      ...newSession,
      id: `sess-${Date.now()}`,
      updatedAtLabel: "à l'instant",
    }
    setSessions((prev) => [...prev, session])
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return sessions
      .filter((s) => (pole === 'all' ? true : s.pole === pole))
      .filter((s) => {
        if (!q) return true
        const hay = `${s.team} ${s.location} ${s.staff.join(' ')} ${s.note ?? ''}`.toLowerCase()
        return hay.includes(q)
      })
  }, [pole, query, sessions])

  const sessionsByDay = React.useMemo(() => groupByDay(filtered), [filtered])

  const total = filtered.length
  const totalDaysWithSessions = React.useMemo(() => {
    return planningDays.filter((d) => (sessionsByDay.get(d)?.length ?? 0) > 0).length
  }, [sessionsByDay])

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Planning (pôles)
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Vue semaine + filtres. Cliquez sur un créneau pour voir les détails ou gérer les
          présences.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Filtres & Actions</CardTitle>
          <CardDescription>
            Filtrer par pôle et rechercher par équipe / staff / lieu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Pôle
              </span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as PlanningPole | 'all')}
                className={inputBaseClassName()}
                aria-label="Filtrer le planning par pôle"
              >
                <option value="all">Tous les pôles</option>
                {planningPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Recherche
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U17, Bernard, Synthétique…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher une séance"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading
                ? 'Chargement du planning…'
                : `${total} séance(s) • ${totalDaysWithSessions} jour(s) avec activité`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPole('all')
                  setQuery('')
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(true)}>
                Ajouter une séance
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Export (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Semaine</CardTitle>
          <CardDescription>
            Affichage “app-like” en colonnes par jour. Cliquez sur un créneau pour interagir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-7">
              {planningDays.map((d) => (
                <div key={d} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 grid gap-2">
                    <div className="h-14 animate-pulse rounded-xl bg-white/10" />
                    <div className="h-14 animate-pulse rounded-xl bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : total === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Aucune séance</p>
              <p className="mt-1 text-sm text-white/65">
                Essayez de changer de pôle ou d’élargir la recherche.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-7">
              {planningDays.map((day) => {
                const sessions = sessionsByDay.get(day) ?? []
                return (
                  <section
                    key={day}
                    aria-label={`Jour ${day}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <header className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                        {day}
                      </p>
                      <p className="text-xs text-white/45">{sessions.length}</p>
                    </header>

                    {sessions.length === 0 ? (
                      <p className="mt-3 text-xs text-white/35">—</p>
                    ) : (
                      <ul className="mt-3 grid gap-2">
                        {sessions.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedSession(s)}
                              className="w-full text-left rounded-xl border border-white/10 bg-black/20 p-3 transition hover:bg-white/5 hover:border-white/20 active:scale-[0.98]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {s.team}
                                  </p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                                    {s.pole}
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full border border-white/15 bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                                  {sessionTimeLabel(s)}
                                </span>
                              </div>

                              <p className="mt-2 text-xs text-white/60">{s.location}</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {s.staff.slice(0, 2).map((st) => (
                                  <span
                                    key={st}
                                    className="text-[10px] text-white/45 bg-white/5 px-1 rounded"
                                  >
                                    {st}
                                  </span>
                                ))}
                                {s.staff.length > 2 && (
                                  <span className="text-[10px] text-white/45">
                                    +{s.staff.length - 2}
                                  </span>
                                )}
                              </div>
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
        title={selectedSession ? `Séance ${selectedSession.team}` : ''}
        description={
          selectedSession ? `${selectedSession.day} • ${sessionTimeLabel(selectedSession)}` : ''
        }
      >
        {selectedSession &&
          (view === 'presence' ? (
            <RosterChecklist
              planningSessionId={selectedSession.id}
              team={selectedSession.team}
              onBack={() => setView('details')}
              onClose={() => setSelectedSession(null)}
            />
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/50">Lieu</p>
                  <p className="mt-1 text-lg font-bold text-white">{selectedSession.location}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/50">Pôle</p>
                  <p className="mt-1 text-lg font-bold text-white">{selectedSession.pole}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-wider text-white/50">Staff présent</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.staff.map((st) => (
                    <span
                      key={st}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSession.note && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="text-xs font-bold uppercase text-yellow-500">Note importante</p>
                  <p className="mt-1 text-sm text-white/80">{selectedSession.note}</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSelectedSession(null)}>
                  Fermer
                </Button>
                <Button onClick={() => setView('presence')}>Gérer les présences</Button>
              </div>

              <p className="text-center text-xs text-white/30 uppercase tracking-widest">
                ID: {selectedSession.id} • Mis à jour {selectedSession.updatedAtLabel}
              </p>
            </div>
          ))}
      </Modal>

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateSession}
      />

      <p className="text-xs text-white/45">
        Note : mock data + state local (localStorage). L’ajout de séance est fonctionnel
        (client-side).
      </p>
    </div>
  )
}
