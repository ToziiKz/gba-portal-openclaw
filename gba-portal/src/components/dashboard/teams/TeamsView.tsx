'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CreateTeamModal } from './CreateTeamModal'

export type TeamWithCoach = {
  id: string
  name: string
  category: string
  gender: string
  coach_id: string | null
  coach?: { full_name: string | null } | null
  players?: { count: number }[]
}

type Props = {
  role?: 'viewer' | 'coach' | 'staff' | 'admin'
  initialTeams: TeamWithCoach[]
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

export function TeamsView({ initialTeams, role = 'viewer' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<string | 'all'>('all')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  
  // Hydrate from URL
  React.useEffect(() => {
    const q = searchParams.get('q')
    const c = searchParams.get('category')
    const t = searchParams.get('teamId')

    if (q) setQuery(q)
    if (c) setCategory(c)

    if (t) {
      setSelectedId(t)
      return
    }

    if (initialTeams.length > 0) {
      setSelectedId((prev) => prev ?? initialTeams[0].id)
    }
  }, [searchParams, initialTeams])

  // Update URL on state change
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (query) params.set('q', query)
    else params.delete('q')
    
    if (category !== 'all') params.set('category', category)
    else params.delete('category')
    
    if (selectedId) params.set('teamId', selectedId)
    else params.delete('teamId')

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [query, category, selectedId, router, searchParams])

  const categories = React.useMemo(() => {
    return Array.from(new Set(initialTeams.map((t) => t.category))).sort()
  }, [initialTeams])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return initialTeams.filter((t) => {
      const matchesCategory = category === 'all' || t.category === category
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.coach?.full_name?.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [initialTeams, query, category])

  const selectedTeam = React.useMemo(() => {
    return filtered.find((t) => t.id === selectedId) || filtered[0] || null
  }, [filtered, selectedId])

  return (
    <>
      <div className="grid gap-6">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Recherche & filtres</CardTitle>
            <CardDescription>
              Gérez vos équipes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Recherche
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: U13, Nom du coach..."
                  className={inputBaseClassName()}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Catégorie
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputBaseClassName()}
                >
                  <option value="all">Toutes</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">{filtered.length} équipe(s)</p>
              {role === 'admin' ? (
                <Button size="sm" variant="secondary" onClick={() => setCreateOpen(true)}>
                  Ajouter une équipe
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="premium-card card-shell rounded-3xl">
            <CardHeader>
              <CardTitle>Liste</CardTitle>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-sm text-white/60">Aucune équipe trouvée.</p>
              ) : (
                <ul className="grid gap-3">
                  {filtered.map((t) => {
                    const isSelected = t.id === selectedTeam?.id
                    const playerCount = t.players?.[0]?.count ?? 0
                    
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(t.id)}
                          className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                            isSelected
                              ? 'border-white/25 bg-white/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-white">{t.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                                {t.category} • {t.gender}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold text-white">{playerCount}</p>
                              <p className="text-xs text-white/45">joueurs</p>
                            </div>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="premium-card card-shell rounded-3xl">
            <CardHeader>
              <CardTitle>Détails</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedTeam ? (
                <p className="text-sm text-white/60">Sélectionnez une équipe.</p>
              ) : (
                <div className="grid gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55">Équipe</p>
                    <p className="mt-2 text-lg font-semibold text-white">{selectedTeam.name}</p>
                    <p className="mt-1 text-sm text-white/70">
                      Catégorie {selectedTeam.category} ({selectedTeam.gender})
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55">Coach</p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {selectedTeam.coach?.full_name ?? 'Non assigné'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/dashboard/joueurs?teamId=${selectedTeam.id}`}>
                      <Button size="sm" variant="secondary">Voir joueurs</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {role === 'admin' ? (
        <CreateTeamModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      ) : null}
    </>
  )
}
