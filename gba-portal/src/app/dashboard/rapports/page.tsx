'use client'

import * as React from 'react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'

import {
  dashboardReportsMock,
  reportPeriods,
  reportPoles,
  type DashboardReportBreakdownRow,
  type DashboardReportKpi,
  type DashboardReportPack,
  type ReportPeriod,
  type ReportPole,
} from '@/lib/mocks/dashboardReports'

type PoleFilter = ReportPole | 'all'

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

function trendLabel(trend: DashboardReportKpi['trend']) {
  switch (trend) {
    case 'up':
      return 'en hausse'
    case 'down':
      return 'en baisse'
    default:
      return 'stable'
  }
}

function trendVariant(trend: DashboardReportKpi['trend']) {
  switch (trend) {
    case 'up':
      return 'success' as const
    case 'down':
      return 'danger' as const
    default:
      return 'neutral' as const
  }
}

function severityVariant(severity: DashboardReportPack['alerts'][number]['severity']) {
  switch (severity) {
    case 'critical':
      return 'danger' as const
    case 'warning':
      return 'warning' as const
    default:
      return 'neutral' as const
  }
}

function ratio(value: number, total: number) {
  if (total <= 0) return 0
  return Math.min(1, Math.max(0, value / total))
}

function percentLabel(value: number, total: number) {
  return `${Math.round(ratio(value, total) * 100)}%`
}

function buildDashboardHref(pathname: string, params: Record<string, string | null | undefined>) {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value.trim()) sp.set(key, value)
  }
  const qs = sp.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

function BreakdownList({ rows }: { rows: DashboardReportBreakdownRow[] }) {
  return (
    <ul className="mt-3 grid gap-2">
      {rows.map((row) => {
        const pct = ratio(row.value, row.total)
        return (
          <li key={row.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{row.label}</p>
                {row.note ? <p className="mt-1 text-xs text-white/45">{row.note}</p> : null}
              </div>
              <p className="shrink-0 text-xs font-semibold text-white/70">
                {row.value}/{row.total} • {percentLabel(row.value, row.total)}
              </p>
            </div>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"
              role="img"
              aria-label={`${row.label} ${percentLabel(row.value, row.total)}`}
            >
              <div className="h-full rounded-full bg-white/35" style={{ width: `${pct * 100}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function DashboardRapportsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [period, setPeriod] = React.useState<ReportPeriod>('7d')
  const [pole, setPole] = React.useState<PoleFilter>('all')

  React.useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 520)
    return () => window.clearTimeout(t)
  }, [])

  const pack = React.useMemo(() => {
    const base =
      dashboardReportsMock.find((p) => p.period === period && p.pole === 'all') ??
      dashboardReportsMock[0]

    if (pole === 'all') return base

    // UI-only (mock): on simule un “filtre pôle” en ajustant légèrement les chiffres.
    const adjust = (value: number, factor: number) => Math.max(0, Math.round(value * factor))
    const factor = pole === 'École de foot' ? 0.9 : pole === 'Pré-formation' ? 1.05 : 1.1

    return {
      ...base,
      pole,
      kpis: base.kpis.map((k) => ({
        ...k,
        value: k.unit === '%' ? Math.min(100, adjust(k.value, factor)) : adjust(k.value, factor),
      })),
      alerts: base.alerts.map((a) => ({ ...a, id: `${a.id}-${pole}` })),
    } satisfies DashboardReportPack
  }, [period, pole])

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Rapports
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Cockpit “staff” : KPIs, alertes et répartitions (mock). Objectif : valider la lisibilité +
          le flux d’actions (exports, relances, tâches) avant branchement DB.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Période & périmètre</CardTitle>
          <CardDescription>Filtrer les KPIs (UI-only, sans persistance).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Période
              </span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                className={inputBaseClassName()}
                aria-label="Choisir une période"
              >
                {reportPeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.note}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Pôle
              </span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as PoleFilter)}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                {reportPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading ? 'Chargement des rapports…' : `maj ${pack.updatedAtLabel} • source: mock`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPole('all')
                  setPeriod('7d')
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Export CSV (bientôt)
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Partager (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>KPIs</CardTitle>
          <CardDescription>
            Indicateurs de pilotage (mock). À venir : objectifs + historique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[118px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {pack.kpis.map((kpi) => (
                <div key={kpi.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">{kpi.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-black tracking-tight text-white">
                      {kpi.value}
                      {kpi.unit ? (
                        <span className="ml-1 text-base font-semibold text-white/60">
                          {kpi.unit}
                        </span>
                      ) : null}
                    </p>
                    <Pill variant={trendVariant(kpi.trend)}>{trendLabel(kpi.trend)}</Pill>
                  </div>
                  <p className="mt-2 text-xs text-white/50">{kpi.hint}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
            <CardDescription>
              Backlog “actionnable” (mock). À venir : assignations + statut.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <li
                    key={idx}
                    className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </ul>
            ) : pack.alerts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune alerte</p>
                <p className="mt-1 text-sm text-white/65">Rien de critique sur la période.</p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {pack.alerts.map((a) => (
                  <li key={a.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{a.title}</p>
                        <p className="mt-1 text-sm text-white/70">{a.desc}</p>
                      </div>
                      <Pill variant={severityVariant(a.severity)} className="shrink-0">
                        {a.severity}
                      </Pill>
                    </div>
                    <p className="mt-3 text-xs text-white/45">
                      Owner: <span className="font-semibold text-white/60">{a.owner}</span> • maj{' '}
                      {a.updatedAtLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" disabled>
                        Ouvrir (bientôt)
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        Marquer traité (bientôt)
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Répartitions</CardTitle>
            <CardDescription>
              3 mini-vues : licences, équipements, présence. À venir : drilldown vers modules
              associés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4">
                <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
                <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
                <div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : (
              <div className="grid gap-5">
                <section aria-label="Répartition licences">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                        Licences
                      </p>
                      <p className="text-xs text-white/45">à encaisser / total</p>
                    </div>
                    <Link
                      href={buildDashboardHref('/dashboard/licences', {
                        pole: pole === 'all' ? null : pole,
                        status: 'overdue',
                      })}
                      className="text-xs font-semibold text-white/75 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label="Ouvrir le module licences pré-filtré sur les retards"
                    >
                      Ouvrir licences →
                    </Link>
                  </div>
                  <BreakdownList rows={pack.licenceBreakdown} />
                </section>

                <section aria-label="Répartition équipements">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                        Équipements
                      </p>
                      <p className="text-xs text-white/45">à traiter</p>
                    </div>
                    <Link
                      href={buildDashboardHref('/dashboard/equipements', {
                        pole: pole === 'all' ? null : pole,
                        delivery: 'todo',
                      })}
                      className="text-xs font-semibold text-white/75 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label="Ouvrir le module équipements pré-filtré sur les dotations à remettre"
                    >
                      Ouvrir équipements →
                    </Link>
                  </div>
                  <BreakdownList rows={pack.equipmentBreakdown} />
                </section>

                <section aria-label="Répartition présence">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                        Présences
                      </p>
                      <p className="text-xs text-white/45">statuts</p>
                    </div>
                    <Link
                      href={buildDashboardHref('/dashboard/presences', {
                        pole: pole === 'all' ? null : pole,
                      })}
                      className="text-xs font-semibold text-white/75 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label="Ouvrir le module présences pré-filtré par pôle"
                    >
                      Ouvrir présences →
                    </Link>
                  </div>
                  <BreakdownList rows={pack.attendanceBreakdown} />
                </section>

                <p className="text-xs text-white/45">
                  Next : liens directs (ex. clic “Licences” → /dashboard/licences avec filtre),
                  exports et historique.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
