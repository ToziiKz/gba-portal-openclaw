'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, User, Clock, MapPin } from 'lucide-react'

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

function sessionTimeLabel(s: Session) {
  return `${s.start_time}–${s.end_time}`
}

function groupByDay(sessions: Session[]) {
  const map = new Map<PlanningDay, Session[]>()
  for (const day of planningDays) map.set(day, [])
  for (const s of sessions) {
    const day = s.day as PlanningDay
    if (map.has(day)) {
      map.get(day)?.push(s)
    }
  }
  for (const day of planningDays) {
    const items = map.get(day)
    if (!items) continue
    items.sort((a, b) => a.start_time.localeCompare(b.start_time))
  }
  return map
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return weekNo
}

function getWeekDays(anchor: Date) {
  const d = new Date(anchor)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  
  return planningDays.map((_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

export function PlanningView({ sessions, teams }: Props) {
  const [currentAnchor, setCurrentAnchor] = React.useState(new Date())
  const [activeSite, setActiveSite] = React.useState<'Ittenheim' | 'Achenheim'>('Ittenheim')
  const [pole, setPole] = React.useState<string | 'all'>('all')
  const [query, setQuery] = React.useState('')
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null)
  const [modalView, setModalView] = React.useState<'details' | 'attendance'>('details')
  const [createOpen, setCreateOpen] = React.useState(false)

  const weekDays = React.useMemo(() => getWeekDays(currentAnchor), [currentAnchor])
  const weekNumber = React.useMemo(() => getWeekNumber(currentAnchor), [currentAnchor])

  const navigateWeek = (direction: number) => {
    const next = new Date(currentAnchor)
    next.setDate(currentAnchor.getDate() + (direction * 7))
    setCurrentAnchor(next)
  }

  const fixedPoles = [
    'École de foot',
    'Pré-formation',
    'Formation',
    'Féminines',
    'Séniors',
    'Vétérans',
    'Super-Vétérans',
    'Évènements',
    'Réunion'
  ]

  React.useEffect(() => {
    if (!selectedSession) setModalView('details')
  }, [selectedSession])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return sessions
      .filter((s) => s.location.includes(activeSite))
      .filter((s) => (pole === 'all' ? true : s.pole === pole))
      .filter((s) => {
        if (!q) return true
        const hay = `${s.team?.name ?? ''} ${s.team?.category ?? ''} ${s.location} ${s.staff.join(' ')} ${s.note ?? ''}`
          .toLowerCase()
        return hay.includes(q)
      })
  }, [sessions, pole, query, activeSite])

  const sessionsByDay = React.useMemo(() => groupByDay(filtered), [filtered])

  return (
    <div className="grid gap-4">
      {/* Top Bar: Site Switcher + Week Navigation + Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {/* Site Switcher */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 w-fit shadow-2xl">
            {(['Ittenheim', 'Achenheim'] as const).map((site) => (
              <button
                key={site}
                onClick={() => setActiveSite(site)}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSite === site 
                    ? 'bg-white !text-black shadow-lg' 
                    : 'text-white hover:text-white hover:bg-white/5'
                }`}
              >
                {site}
              </button>
            ))}
          </div>

          {/* Week Nav */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 shadow-2xl">
            <button 
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center">
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Semaine {weekNumber}</span>
            </div>
            <button 
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <select
              value={pole}
              onChange={(e) => setPole(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-white/20 transition-all"
            >
              <option value="all">Tous les Pôles</option>
              {fixedPoles.map((p) => (
                <option key={p} value={p} className="text-black">{p}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-bold text-white placeholder:text-white/20 outline-none focus:border-white/20 min-w-[180px] transition-all"
            />
          </div>

          <Button size="sm" variant="ghost" className="h-10 px-5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 hover:bg-white/5" onClick={() => setCreateOpen(true)}>
            + Séance
          </Button>
        </div>
      </div>

      <Card className="premium-card card-shell rounded-3xl overflow-hidden border-white/5 shadow-2xl">
        <CardHeader className="py-6 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black uppercase tracking-widest">Planning Hebdomadaire</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">{filtered.length} séance(s) à {activeSite}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 bg-black/20">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-white/5 mx-auto mb-4" />
              <p className="text-sm font-semibold text-white/40 uppercase tracking-widest">Aucune séance planifiée</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
              {planningDays.map((day, idx) => {
                const items = sessionsByDay.get(day) ?? []
                const date = weekDays[idx]
                const isToday = new Date().toDateString() === date.toDateString()
                
                return (
                  <section key={day} className={`rounded-2xl border transition-all p-4 ${isToday ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_40px_rgba(6,182,212,0.05)]' : 'border-white/5 bg-white/[0.02]'}`}>
                    <header className="flex flex-col gap-1 border-b border-white/5 pb-3 mb-4">
                      <div className="flex items-baseline justify-between">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-cyan-400' : 'text-white/30'}`}>{day}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isToday ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/20'}`}>{items.length}</span>
                      </div>
                      <p className={`text-sm font-black tracking-tight ${isToday ? 'text-white' : 'text-white/60'}`}>
                        {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </p>
                    </header>

                    {items.length === 0 ? (
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/5 italic">Repos</p>
                    ) : (
                      <ul className="grid gap-3">
                        {items.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedSession(s)}
                              className="w-full text-left rounded-xl border border-white/5 bg-black/40 p-4 transition-all hover:bg-white/[0.04] hover:border-white/20 group active:scale-[0.98]"
                            >
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">{s.team?.name ?? '—'}</p>
                                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{s.pole}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.03]">
                                   <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                     <Clock className="w-3 h-3 text-cyan-500/50" />
                                     {s.start_time}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                     <MapPin className="w-3 h-3 text-cyan-500/50" />
                                     {s.location.split('-').pop()?.trim()}
                                   </div>
                                </div>
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
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <MapPin className="w-4 h-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Lieu</p>
                  </div>
                  <p className="text-lg font-black text-white uppercase tracking-tight">{selectedSession.location}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <User className="w-4 h-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Pôle</p>
                  </div>
                  <p className="text-lg font-black text-white uppercase tracking-tight">{selectedSession.pole}</p>
                </div>
              </div>

              {selectedSession.note ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Note</p>
                  <p className="text-sm text-white/80 leading-relaxed italic">&quot;{selectedSession.note}&quot;</p>
                </div>
              ) : null}

              <div className="pt-4 border-t border-white/10 flex flex-wrap justify-end gap-3">
                {selectedSession.team ? (
                  <Button onClick={() => setModalView('attendance')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-[10px]">
                    Gérer les présences
                  </Button>
                ) : null}
                <form action={deletePlanningSession}>
                  <input type="hidden" name="id" value={selectedSession.id} />
                  <Button variant="secondary" type="submit" className="font-black uppercase tracking-widest text-[10px] text-rose-400 border-rose-500/20">
                    Supprimer
                  </Button>
                </form>
                <Button variant="secondary" onClick={() => setSelectedSession(null)} className="font-black uppercase tracking-widest text-[10px]">
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
