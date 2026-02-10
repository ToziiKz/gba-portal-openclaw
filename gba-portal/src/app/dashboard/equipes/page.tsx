'use client'

import * as React from 'react'

import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  dashboardTeamsMock,
  dashboardTeamPoles,
  type DashboardTeam,
  type TeamPole,
} from '@/lib/mocks/dashboardTeams'

function roleLabel(role: DashboardTeam['staff'][number]['role']) {
  switch (role) {
    case 'coach':
      return 'Coach'
    case 'adjoint':
      return 'Adjoint'
    case 'dir-sportif':
      return 'Direction sportive'
    case 'resp-pôle':
      return 'Responsable pôle'
    default:
      return role
  }
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

export default function DashboardEquipesPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [pole, setPole] = React.useState<TeamPole | 'all'>('all')
  const [category, setCategory] = React.useState<string | 'all'>('all')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const didInitFromUrl = React.useRef(false)

  React.useEffect(() => {
    if (didInitFromUrl.current) return

    const sp = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)

    const poleRaw = sp.get('pole')
    const categoryRaw = sp.get('category')
    const qRaw = sp.get('q') ?? sp.get('query')

    if (poleRaw && (dashboardTeamPoles as string[]).includes(poleRaw)) setPole(poleRaw as TeamPole)
    if (categoryRaw && categoryRaw.trim()) setCategory(categoryRaw.trim())
    if (typeof qRaw === 'string' && qRaw.trim()) setQuery(qRaw)

    didInitFromUrl.current = true
  }, [])

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoading(false)
      setSelectedId((prev) => prev ?? dashboardTeamsMock[0]?.id ?? null)
    }, 450)

    return () => window.clearTimeout(t)
  }, [])

  const categories = React.useMemo(() => {
    return Array.from(new Set(dashboardTeamsMock.map((t) => t.category))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()

    return dashboardTeamsMock
      .filter((t) => (pole === 'all' ? true : t.pole === pole))
      .filter((t) => (category === 'all' ? true : t.category === category))
      .filter((t) => {
        if (!q) return true
        const hay =
          `${t.name} ${t.category} ${t.pole} ${t.staff.map((s) => s.name).join(' ')}`.toLowerCase()
        return hay.includes(q)
      })
  }, [query, pole, category])

  const selectedTeam = React.useMemo(() => {
    return filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? null
  }, [filtered, selectedId])

  React.useEffect(() => {
    if (!selectedTeam) setSelectedId(null)
    else setSelectedId(selectedTeam.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam?.id])

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Équipes
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Liste + sélection d’une équipe. Données mock + state local uniquement. Les actions
          (édition, affectations) sont des placeholders.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>
            Filtrer par pôle / catégorie, ou rechercher par nom / staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Recherche
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U13, Leroy…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher une équipe"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Pôle
              </span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as TeamPole | 'all')}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                {dashboardTeamPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Catégorie
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputBaseClassName()}
                aria-label="Filtrer par catégorie"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading ? 'Chargement des équipes…' : `${filtered.length} équipe(s) (mock)`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setPole('all')
                  setCategory('all')
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Ajouter une équipe (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Liste</CardTitle>
            <CardDescription>Sélectionnez une équipe pour afficher les détails.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-[84px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </ul>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune équipe</p>
                <p className="mt-1 text-sm text-white/65">
                  Essayez de modifier les filtres, ou de simplifier la recherche.
                </p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filtered.map((t) => {
                  const isSelected = t.id === selectedTeam?.id
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
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{t.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {t.pole} • {t.category}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-white">{t.playersCount}</p>
                            <p className="text-xs text-white/45">joueurs</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                            {t.sessionsWeekly} séances/sem.
                          </span>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            maj {t.lastUpdateLabel}
                          </span>
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
            <CardDescription>Fiche rapide de l’équipe sélectionnée.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : !selectedTeam ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune sélection</p>
                <p className="mt-1 text-sm text-white/65">Choisissez une équipe dans la liste.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Équipe</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedTeam.name}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {selectedTeam.pole} • {selectedTeam.category} • {selectedTeam.playersCount}{' '}
                    joueurs
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">
                    Encadrement (mock)
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {selectedTeam.staff.map((m) => (
                      <li key={m.id} className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-white">{m.name}</span>
                        <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                          {roleLabel(m.role)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/joueurs?team=${encodeURIComponent(selectedTeam.name)}&pole=${encodeURIComponent(
                      selectedTeam.pole
                    )}`}
                  >
                    <Button size="sm" variant="secondary">
                      Voir joueurs
                    </Button>
                  </Link>
                  <Button size="sm" variant="secondary" disabled>
                    Modifier (bientôt)
                  </Button>
                  <Button size="sm" variant="ghost" disabled>
                    Assigner staff (bientôt)
                  </Button>
                </div>

                <p className="text-xs text-white/45">
                  À venir : fiches équipe complètes (contacts, créneaux, effectif, présences) +
                  permissioning.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
