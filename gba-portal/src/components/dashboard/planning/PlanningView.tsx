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
  session_date?: string | null
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

    const weekStart = new Date(weekDays[0])
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekDays[6])
    weekEnd.setHours(23, 59, 59, 999)

    return sessions
      .filter((s) => {
        const sLoc = (s.location || '').toLowerCase()
        const aLoc = (activeSite || '').toLowerCase()
        return sLoc.includes(aLoc)
      })
      .filter((s) => (pole === 'all' ? true : s.pole === pole))
      .filter((s) => {
        // If a specific date exists, only show it in its corresponding week
        if (!s.session_date) return true
        const d = new Date(`${s.session_date}T00:00:00`)
        return d >= weekStart && d <= weekEnd
      })
      .filter((s) => {
        if (!q) return true
        const hay = `${s.team?.name ?? ''} ${s.team?.category ?? ''} ${s.location} ${s.staff.join(' ')} ${s.note ?? ''}`.toLowerCase()
        return hay.includes(q)
      })
  }, [sessions, pole, query, activeSite, weekDays])

  const sessionsByDay = React.useMemo(() => {
    const map = new Map<PlanningDay, Session[]>()
    for (const d of planningDays) map.set(d, [])
    
    for (const s of filtered) {
      const d = s.day as PlanningDay
      if (map.has(d)) {
        map.get(d)?.push(s)
      }
    }
    
    for (const d of planningDays) {
      map.get(d)?.sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
    }
    return map
  }, [filtered])

  return (
    <div className="grid gap-4">
      {/* Top Bar: Site Switcher + Week Navigation + Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {/* Site Switcher */}
          <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit">
            {(['Ittenheim', 'Achenheim'] as const).map((site) => (
              <button
                key={site}
                type="button"
                onClick={() => setActiveSite(site)}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSite === site 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                {site}
              </button>
            ))}
          </div>

          {/* Week Nav */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button 
              type="button"
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Semaine {weekNumber}</span>
            </div>
            <button 
              type="button"
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
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
              className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:border-blue-300 transition-all appearance-none"
            >
              <option value="all">Tous les Pôles</option>
              {fixedPoles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-blue-300 min-w-[180px] transition-all"
            />
          </div>

          <Button type="button" size="sm" variant="ghost" className="h-10 px-5 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 hover:bg-slate-50 text-slate-600" onClick={() => setCreateOpen(true)}>
            + Séance
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl !text-slate-900">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-6">
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Planning Hebdomadaire</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            {filtered.length} séance(s) à {activeSite}
          </p>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {planningDays.map((day, idx) => {
            const items = sessionsByDay.get(day) ?? []
            const date = weekDays[idx]
            const isToday = new Date().toDateString() === date.toDateString()

            return (
              <section key={day} className={`flex flex-col rounded-2xl border transition-all p-4 ${isToday ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-slate-50/30'}`}>
                <header className="flex flex-col gap-1 border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-baseline justify-between">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{day}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isToday ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{items.length}</span>
                  </div>
                  <p className={`text-sm font-black tracking-tight ${isToday ? 'text-slate-900' : 'text-slate-700'}`}>
                    {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>
                </header>

                <div className="flex-1">
                  {items.length === 0 ? (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 italic">Repos</p>
                  ) : (
                    <ul className="grid gap-3">
                      {items.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedSession(s)}
                            className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md group active:scale-[0.98]"
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors">{s.team?.name ?? '—'}</p>
                                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{s.pole}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                  <Clock className="w-3 h-3 text-blue-400" />
                                  {s.start_time}
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                  <MapPin className="w-3 h-3 text-blue-400" />
                                  {s.location.split('-').pop()?.trim()}
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )
          })}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Aucune séance trouvée pour {activeSite} (mais la navigation semaine est active)
          </p>
        ) : null}
      </div>

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
