'use client'

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Pill'

import {
  dashboardRemindersMock,
  reminderKinds,
  reminderPoles,
  type DashboardReminderRow,
  type ReminderKind,
  type ReminderPole,
} from '@/lib/mocks/dashboardRelances'

type KindFilter = ReminderKind | 'all'
type RowStatus = 'todo' | 'done' | 'snoozed'

type LocalRowState = {
  status: RowStatus
  updatedAtLabel: string
}

function inputBaseClassName() {
  return 'w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20'
}

function kindLabel(kind: DashboardReminderRow['kind']) {
  return kind === 'licence' ? 'licence' : 'équipement'
}

function kindVariant(kind: DashboardReminderRow['kind']) {
  return kind === 'licence' ? ('warning' as const) : ('neutral' as const)
}

function statusVariant(status: RowStatus) {
  switch (status) {
    case 'done':
      return 'success' as const
    case 'snoozed':
      return 'neutral' as const
    default:
      return 'danger' as const
  }
}

function statusLabel(status: RowStatus) {
  switch (status) {
    case 'done':
      return 'traité'
    case 'snoozed':
      return 'snoozé'
    default:
      return 'à faire'
  }
}

function formatEur(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function buildMessage(row: DashboardReminderRow) {
  if (row.kind === 'licence') {
    const amount =
      typeof row.amountDueEur === 'number' ? formatEur(row.amountDueEur) : '(montant ?)'
    const due = row.dueDateLabel ? ` (échéance ${row.dueDateLabel})` : ''

    return [
      `Bonjour ${row.contactName},`,
      '',
      `Petit rappel pour la licence de ${row.playerName} (${row.team}, ${row.category}).`,
      `Montant restant : ${amount}${due}.`,
      '',
      'Merci de nous confirmer le règlement ou la date prévue.',
      'Sportivement,',
      'GBA — Staff',
      '',
      '',
    ].join('\n')
  }

  const todo = row.equipmentTodoLabel
    ? `Équipement à traiter : ${row.equipmentTodoLabel}.`
    : 'Équipement à traiter.'
  return [
    `Bonjour ${row.contactName},`,
    '',
    `On prépare la dotation équipement pour ${row.playerName} (${row.team}, ${row.category}).`,
    todo,
    '',
    'Pouvez-vous nous confirmer la/les taille(s) manquante(s) si besoin ?',
    'Merci !',
    'GBA — Staff',
    '',
    '',
  ].join('\n')
}

export default function DashboardRelancesPage() {
  const [isLoading, setIsLoading] = React.useState(true)

  const [query, setQuery] = React.useState('')
  const [kind, setKind] = React.useState<KindFilter>('all')
  const [pole, setPole] = React.useState<ReminderPole | 'all'>('all')
  const [onlyTodo, setOnlyTodo] = React.useState(true)

  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<string | null>(null)

  const [localState, setLocalState] = React.useState<Record<string, LocalRowState>>(() =>
    Object.fromEntries(
      dashboardRemindersMock.map((r) => [
        r.id,
        {
          status: 'todo' as const,
          updatedAtLabel: r.lastActionLabel,
        },
      ])
    )
  )

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoading(false)
      setSelectedId((prev) => prev ?? dashboardRemindersMock[0]?.id ?? null)
    }, 420)

    return () => window.clearTimeout(t)
  }, [])

  React.useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase()

    return dashboardRemindersMock
      .filter((r) => (kind === 'all' ? true : r.kind === kind))
      .filter((r) => (pole === 'all' ? true : r.pole === pole))
      .filter((r) => {
        if (!onlyTodo) return true
        return (localState[r.id]?.status ?? 'todo') === 'todo'
      })
      .filter((r) => {
        if (!q) return true
        const hay =
          `${r.playerName} ${r.team} ${r.category} ${r.pole} ${r.contactName}`.toLowerCase()
        return hay.includes(q)
      })
  }, [query, kind, pole, onlyTodo, localState])

  const selectedRow = React.useMemo(() => {
    return rows.find((r) => r.id === selectedId) ?? rows[0] ?? null
  }, [rows, selectedId])

  React.useEffect(() => {
    if (!selectedRow) setSelectedId(null)
    else setSelectedId(selectedRow.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow?.id])

  const todoCount = React.useMemo(() => {
    return Object.values(localState).filter((s) => s.status === 'todo').length
  }, [localState])

  function updateRowStatus(id: string, status: RowStatus) {
    setLocalState((prev) => ({
      ...prev,
      [id]: {
        status,
        updatedAtLabel: 'à l’instant',
      },
    }))
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Relances
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Liste de relances (mock) : licences à encaisser + équipements à traiter. Objectif :
          valider l’UX “backlog actionnable” avant branchement DB + envois (email/SMS/WhatsApp).
        </p>
      </div>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
        >
          {toast}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">
              À traiter
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">
              {todoCount}
              <span className="ml-2 text-xs font-semibold text-white/45">(state local)</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">
              Lignes visibles
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">
              {isLoading ? '—' : rows.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">
              Source
            </CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">mock</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>
            Filtrer par type/pôle, puis rechercher par joueur/équipe/contact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Type
              </span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as KindFilter)}
                className={inputBaseClassName()}
                aria-label="Filtrer par type"
              >
                {reminderKinds.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label} — {k.note}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Pôle
              </span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as ReminderPole | 'all')}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                {reminderPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Recherche
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U13, Diallo, parent…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher une relance"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <input
                type="checkbox"
                checked={onlyTodo}
                onChange={(e) => setOnlyTodo(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-white/75">Afficher uniquement “à faire”</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setKind('all')
                  setPole('all')
                  setOnlyTodo(true)
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Envoi groupé (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Backlog</CardTitle>
            <CardDescription>Sélectionnez une ligne pour voir l’aperçu du message.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                  />
                ))}
              </ul>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucun résultat</p>
                <p className="mt-1 text-sm text-white/65">
                  Essayez de modifier les filtres ou la recherche.
                </p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {rows.map((r) => {
                  const isSelected = r.id === selectedRow?.id
                  const st = localState[r.id]?.status ?? 'todo'

                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                          isSelected
                            ? 'border-white/25 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7'
                        }`}
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{r.playerName}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {r.team} • {r.pole}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <Pill variant={statusVariant(st)}>{statusLabel(st)}</Pill>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Pill variant={kindVariant(r.kind)}>{kindLabel(r.kind)}</Pill>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                            {r.category}
                          </span>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            canal: {r.channelHint}
                          </span>
                        </div>

                        {r.kind === 'licence' && typeof r.amountDueEur === 'number' ? (
                          <p className="mt-2 text-xs text-white/60">
                            Reste: {formatEur(r.amountDueEur)}
                          </p>
                        ) : null}
                        {r.kind === 'equipment' && r.equipmentTodoLabel ? (
                          <p className="mt-2 text-xs text-white/60">{r.equipmentTodoLabel}</p>
                        ) : null}

                        <p className="mt-2 text-[11px] text-white/35">
                          {localState[r.id]?.updatedAtLabel ?? r.lastActionLabel}
                        </p>
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
            <CardTitle>Aperçu & actions</CardTitle>
            <CardDescription>
              UI-only : copier/coller le message puis marquer traité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : !selectedRow ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune sélection</p>
                <p className="mt-1 text-sm text-white/65">Choisissez une ligne dans le backlog.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Cible</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedRow.playerName}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {selectedRow.team} • {selectedRow.category} • {selectedRow.pole}
                  </p>
                  <p className="mt-2 text-xs text-white/45">
                    Contact : {selectedRow.contactName}
                    {selectedRow.contactEmail ? ` · ${selectedRow.contactEmail}` : ''}
                    {selectedRow.contactPhone ? ` · ${selectedRow.contactPhone}` : ''}
                  </p>
                </div>

                {selectedRow.note ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55">Note</p>
                    <p className="mt-2 text-sm text-white/70">{selectedRow.note}</p>
                  </div>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                    Message (mock)
                  </p>
                  <pre className="mt-3 min-h-[260px] whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/70">
                    {buildMessage(selectedRow)}
                  </pre>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(buildMessage(selectedRow))
                          setToast('Message copié (clipboard)')
                        } catch {
                          setToast('Impossible de copier (permissions navigateur)')
                        }
                      }}
                    >
                      Copier
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateRowStatus(selectedRow.id, 'done')}
                    >
                      Marquer traité
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateRowStatus(selectedRow.id, 'snoozed')}
                    >
                      Snoozer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateRowStatus(selectedRow.id, 'todo')}
                    >
                      Remettre à faire
                    </Button>
                  </div>

                  <p className="mt-3 text-xs text-white/45">
                    Next : templates par canal, envoi réel (email/SMS/WhatsApp), log des relances,
                    règles anti-spam, permissions.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
