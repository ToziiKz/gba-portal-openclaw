'use client'

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

import { CreatePlanningSessionModal } from './CreatePlanningSessionModal'
import { deletePlanningSession } from '@/app/dashboard/planning/actions'
import { RosterChecklist } from '@/components/dashboard/RosterChecklist'

const planningDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const

type PlanningDay = (typeof planningDays)[number]

export type TeamOption = { id: string; name: string; category: string }

export type Session = {
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
  sessions: Session[]
  teams: TeamOption[]
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

function sessionTimeLabel(s: Session) {
  return `${s.start_time}–${s.end_time}`
}

function groupByDay(sessions: Session[]) {
  const map = new Map<PlanningDay, Session[]>()
  for (const day of planningDays) map.set(day, [])
  for (const s of sessions) map.get(s.day)?.push(s)
  for (const day of planningDays) {
    const items = map.get(day)
    if (!items) continue
    items.sort((a, b) => a.start_time.localeCompare(b.start_time))
  }
  return map
}

export function PlanningView({ sessions, teams }: Props) {
  const [pole, setPole] = React.useState<string | 'all'>('all')
  const [query, setQuery] = React.useState('')
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null)
  const [modalView, setModalView] = React.useState<'details' | 'attendance'>('details')
  const [createOpen, setCreateOpen] = React.useState(false)

  React.useEffect(() => {
    if (!selectedSession) setModalView('details')
  }, [selectedSession])

  const poles = React.useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.pole))).sort()
  }, [sessions])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return sessions
      .filter((s) => (pole === 'all' ? true : s.pole === pole))
      .filter((s) => {
        if (!q) return true
        const hay = `${s.team?.name ?? ''} ${s.team?.category ?? ''} ${s.location} ${s.staff.join(' ')} ${s.note ?? ''}`
          .toLowerCase()
        return hay.includes(q)
      })
  }, [sessions, pole, query])

  const sessionsByDay = React.useMemo(() => groupByDay(filtered), [filtered])

  return (
    <div className="grid gap-6">
      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Filtres & Actions</CardTitle>
          <CardDescription>Filtrer par pôle et rechercher par équipe / staff / lieu.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value)}
                className={inputBaseClassName()}
              >
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
                placeholder="Ex: U17, Bernard, Synthétique…"
                className={inputBaseClassName()}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60">{filtered.length} séance(s)</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => { setPole('all'); setQuery('') }}>
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreateOpen(true)}>
                Ajouter une séance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Semaine</CardTitle>
          <CardDescription>Affichage en colonnes par jour. Cliquez sur un créneau pour les détails.</CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Aucune séance</p>
              <p className="mt-1 text-sm text-white/65">Ajoutez une séance pour démarrer.</p>
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
        title={selectedSession ? `Séance ${selectedSession.team?.name ?? ''}` : ''}
        description={selectedSession ? `${selectedSession.day} • ${sessionTimeLabel(selectedSession)}` : ''}
      >
        {selectedSession ? (
          modalView === 'attendance' && selectedSession.team ? (
            <RosterChecklist
              sessionId={selectedSession.id}
              teamId={selectedSession.team.id}
              teamLabel={`${selectedSession.team.category} • ${selectedSession.team.name}`}
              onBack={() => setModalView('details')}
              onClose={() => setSelectedSession(null)}
            />
          ) : (
            <div className="space-y-6">
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

              {selectedSession.note ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/50">Note</p>
                  <p className="mt-2 text-sm text-white/80">{selectedSession.note}</p>
                </div>
              ) : null}

              <div className="pt-4 border-t border-white/10 flex flex-wrap justify-end gap-3">
                {selectedSession.team ? (
                  <Button onClick={() => setModalView('attendance')}>
                    Gérer les présences
                  </Button>
                ) : null}
                <form action={deletePlanningSession}>
                  <input type="hidden" name="id" value={selectedSession.id} />
                  <Button variant="secondary" type="submit">
                    Supprimer
                  </Button>
                </form>
                <Button variant="secondary" onClick={() => setSelectedSession(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          )
        ) : null}
      </Modal>

      <CreatePlanningSessionModal isOpen={createOpen} onClose={() => setCreateOpen(false)} teams={teams} />
    </div>
  )
}
