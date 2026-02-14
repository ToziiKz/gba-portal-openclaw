'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { createApprovalRequest } from '@/lib/approvals'
import { usePermissions } from '@/components/PermissionsProvider'
import Link from 'next/link'

const COMPETITIONS_STORAGE_KEY = 'gba-dashboard-competitions-v1'

type CompetitionResult = {
  id: string
  category: string
  teamHome: string
  teamAway: string
  scoreHome: number
  scoreAway: number
  date: string
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function generateMatchId() {
  return `match-${Math.random().toString(36).slice(2)}`
}

export default function CompetitionsPage() {
  const { role } = usePermissions()
  const isAdmin = role === 'admin'
  const [results, setResults] = React.useState<CompetitionResult[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  // Form State
  const [category, setCategory] = React.useState('U15')
  const [teamHome, setTeamHome] = React.useState('GBA')
  const [teamAway, setTeamAway] = React.useState('')
  const [scoreHome, setScoreHome] = React.useState(0)
  const [scoreAway, setScoreAway] = React.useState(0)
  const [date, setDate] = React.useState('')

  const reload = React.useCallback(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(COMPETITIONS_STORAGE_KEY)
    setResults(safeParse<CompetitionResult[]>(raw, []))
  }, [])

  React.useEffect(() => {
    reload()
    const onStorage = (e: StorageEvent) => {
      if (e.key === COMPETITIONS_STORAGE_KEY) reload()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [reload])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // eslint-disable-next-line
    const payload: CompetitionResult = {
      id: generateMatchId(),
      category,
      teamHome,
      teamAway,
      scoreHome,
      scoreAway,
      date: date || new Date().toISOString().split('T')[0]
    }

    if (isAdmin) {
      // Direct save for admin
      const next = [payload, ...results]
      window.localStorage.setItem(COMPETITIONS_STORAGE_KEY, JSON.stringify(next))
      setResults(next)
      setFeedback('Résultat enregistré (admin).')
    } else {
      createApprovalRequest({
        authorRole: role,
        action: 'competition.create_result',
        payload
      })
      setFeedback('Résultat proposé ! En attente de validation admin.')
    }

    setIsModalOpen(false)
    resetForm() // Keep category/teamHome via state logic if needed, but here we reset all for clean slate
    
    // Clear feedback after 3s
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleDelete = (id: string) => {
    if (!isAdmin) return
    if (!window.confirm('Supprimer ce résultat ?')) return
    const next = results.filter(r => r.id !== id)
    window.localStorage.setItem(COMPETITIONS_STORAGE_KEY, JSON.stringify(next))
    setResults(next)
  }

  const resetForm = () => {
    // We keep category/teamHome as they are often reused
    setTeamAway('')
    setScoreHome(0)
    setScoreAway(0)
    setDate('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Compétitions</h1>
          <p className="text-black/60">Suivi des résultats et classements.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Ajouter un résultat</Button>
      </div>

      {feedback && (
        <div className="rounded-2xl bg-black/5 p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-medium text-black">{feedback}</p>
          {!isAdmin && (
            <Link href="/dashboard/validations" className="text-xs font-bold underline decoration-black/30 underline-offset-4 hover:decoration-black/100">
              Voir suivis
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-black/10 bg-black/5 p-12 text-center">
            <p className="text-black/40">Aucun résultat enregistré.</p>
          </div>
        ) : (
          results.map((res) => (
            <Card key={res.id} className="premium-card card-shell rounded-3xl group relative">
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(res.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  title="Supprimer"
                >
                  ×
                </button>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{res.category}</span>
                   <span className="text-xs text-black/40">{res.date}</span>
                </div>
                <CardTitle className="text-lg flex justify-between items-center">
                    <span>{res.teamHome}</span>
                    <span className="text-black/40 text-sm">vs</span>
                    <span>{res.teamAway}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-4 bg-black/5 rounded-2xl">
                    <span className="text-3xl font-black tabular-nums tracking-tighter">
                        {res.scoreHome} - {res.scoreAway}
                    </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Proposer un résultat"
        description="Ce résultat sera soumis à validation par un administrateur."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/55">Catégorie</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
              >
                {['U9', 'U11', 'U13', 'U15', 'U17', 'U20', 'Seniors'].map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black/55">Date</label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/55">Domicile</label>
                <input 
                    type="text"
                    value={teamHome}
                    onChange={e => setTeamHome(e.target.value)}
                    placeholder="Equipe A"
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/55">Score</label>
                <input 
                    type="number"
                    value={scoreHome}
                    onChange={e => setScoreHome(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
                    min="0"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/55">Extérieur</label>
                <input 
                    type="text"
                    value={teamAway}
                    onChange={e => setTeamAway(e.target.value)}
                    placeholder="Equipe B"
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black/55">Score</label>
                <input 
                    type="number"
                    value={scoreAway}
                    onChange={e => setScoreAway(parseInt(e.target.value))}
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm outline-none focus:border-black/20"
                    min="0"
                />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit">{isAdmin ? 'Enregistrer' : 'Proposer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
