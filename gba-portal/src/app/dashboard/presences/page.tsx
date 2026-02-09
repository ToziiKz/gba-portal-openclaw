"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";

import {
  attendanceSessionsMock,
  type AttendanceSession,
  type AttendanceStatus,
} from "@/lib/mocks/dashboardAttendance";

type PoleFilter = AttendanceSession["pole"] | "all";

type RowState = {
  status: AttendanceStatus;
  note?: string;
  updatedAtLabel: string;
};

type Action =
  | { type: "setStatus"; sessionId: string; rowId: string; status: AttendanceStatus }
  | { type: "resetSession"; sessionId: string }
  | { type: "restore"; state: Record<string, Record<string, RowState>> };

function inputBaseClassName() {
  return "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20";
}

function statusLabel(status: AttendanceStatus) {
  switch (status) {
    case "present":
      return "présent";
    case "absent":
      return "absent";
    case "late":
      return "retard";
    case "excused":
      return "justifié";
    default:
      return status;
  }
}

function statusVariant(status: AttendanceStatus) {
  switch (status) {
    case "present":
      return "success" as const;
    case "late":
      return "warning" as const;
    case "excused":
      return "neutral" as const;
    case "absent":
      return "danger" as const;
    default:
      return "neutral" as const;
  }
}

function reducer(
  state: Record<string, Record<string, RowState>>,
  action: Action,
): Record<string, Record<string, RowState>> {
  switch (action.type) {
    case "restore": {
      return action.state;
    }
    case "setStatus": {
      const sessionState = state[action.sessionId];
      if (!sessionState) return state;
      const row = sessionState[action.rowId];
      if (!row) return state;

      return {
        ...state,
        [action.sessionId]: {
          ...sessionState,
          [action.rowId]: {
            ...row,
            status: action.status,
            updatedAtLabel: "à l’instant",
          },
        },
      };
    }
    case "resetSession": {
      const base = attendanceSessionsMock.find((s) => s.id === action.sessionId);
      if (!base) return state;

      return {
        ...state,
        [action.sessionId]: Object.fromEntries(
          base.rows.map((r) => [
            r.id,
            {
              status: r.status,
              note: r.note,
              updatedAtLabel: base.updatedAtLabel,
            },
          ]),
        ) as Record<string, RowState>,
      };
    }
    default:
      return state;
  }
}

function sessionTimeLabel(session: AttendanceSession) {
  return `${session.start}–${session.end}`;
}

function counts(session: AttendanceSession, sessionState: Record<string, RowState> | undefined) {
  const rows = session.rows;
  const result = { present: 0, absent: 0, late: 0, excused: 0, total: rows.length };

  for (const row of rows) {
    const status = sessionState?.[row.id]?.status ?? row.status;
    result[status] += 1;
  }

  return result;
}

const STORAGE_KEY = "gba-dashboard-presences-state-v1";

export default function DashboardPresencesPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [pole, setPole] = React.useState<PoleFilter>("all");
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);

  const didInitFromUrl = React.useRef(false);
  const didRestore = React.useRef(false);

  const [state, dispatch] = React.useReducer(
    reducer,
    attendanceSessionsMock,
    (sessions) =>
      Object.fromEntries(
        sessions.map((s) => [
          s.id,
          Object.fromEntries(
            s.rows.map((r) => [
              r.id,
              {
                status: r.status,
                note: r.note,
                updatedAtLabel: s.updatedAtLabel,
              },
            ]),
          ) as Record<string, RowState>,
        ]),
      ) as Record<string, Record<string, RowState>>,
  );

  React.useEffect(() => {
    if (didInitFromUrl.current) return;

    const sp = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

    const poleRaw = sp.get("pole");
    const qRaw = sp.get("q") ?? sp.get("query");
    const sessionRaw = sp.get("session") ?? sp.get("sessionId");

    const poles: Array<AttendanceSession["pole"]> = ["École de foot", "Pré-formation", "Formation"];
    if (poleRaw && poles.includes(poleRaw as AttendanceSession["pole"])) setPole(poleRaw as AttendanceSession["pole"]);

    if (typeof qRaw === "string" && qRaw.trim()) setQuery(qRaw);

    if (typeof sessionRaw === "string" && sessionRaw.trim()) setSelectedSessionId(sessionRaw.trim());

    didInitFromUrl.current = true;
  }, []);

  // Restore persisted local state (localStorage)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, Record<string, RowState>>;
        dispatch({ type: "restore", state: parsed });
      }
    } catch (e) {
      console.warn("Failed to restore presences state", e);
    } finally {
      didRestore.current = true;
    }
  }, []);

  // Persist local state
  React.useEffect(() => {
    if (!didRestore.current || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist presences state", e);
    }
  }, [state]);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoading(false);
      setSelectedSessionId((prev) => prev ?? attendanceSessionsMock[0]?.id ?? null);
    }, 480);

    return () => window.clearTimeout(t);
  }, []);

  const filteredSessions = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return attendanceSessionsMock
      .filter((s) => (pole === "all" ? true : s.pole === pole))
      .filter((s) => {
        if (!q) return true;
        const hay = `${s.team} ${s.location} ${s.day} ${s.pole}`.toLowerCase();
        return hay.includes(q);
      });
  }, [pole, query]);

  const selectedSession = React.useMemo(() => {
    return filteredSessions.find((s) => s.id === selectedSessionId) ?? filteredSessions[0] ?? null;
  }, [filteredSessions, selectedSessionId]);

  React.useEffect(() => {
    if (!selectedSession) setSelectedSessionId(null);
    else setSelectedSessionId(selectedSession.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession?.id]);

  const selectedCounts = React.useMemo(() => {
    if (!selectedSession) return null;
    return counts(selectedSession, state[selectedSession.id]);
  }, [selectedSession, state]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Présences
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Suivi des présences par séance (mock) : sélection séance → liste joueurs → statut (présent/retard/justifié/absent).
          Données mock + state local uniquement.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>Filtrer par pôle et rechercher une séance (équipe / lieu / jour).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as PoleFilter)}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                <option value="École de foot">École de foot</option>
                <option value="Pré-formation">Pré-formation</option>
                <option value="Formation">Formation</option>
              </select>
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recherche</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U13, Synthétique, mercredi…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher une séance"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading ? "Chargement des séances…" : `${filteredSessions.length} séance(s) (mock)`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPole("all");
                  setQuery("");
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Export (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Séances</CardTitle>
            <CardDescription>Sélectionnez une séance pour gérer les présences.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </ul>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune séance</p>
                <p className="mt-1 text-sm text-white/65">Essayez de modifier le pôle ou la recherche.</p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filteredSessions.map((s) => {
                  const isSelected = s.id === selectedSession?.id;
                  const c = counts(s, state[s.id]);

                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSessionId(s.id)}
                        className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7"
                        }`}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{s.team}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {s.day} • {s.pole}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                            {sessionTimeLabel(s)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-white/60">{s.location}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill variant="success">{c.present} présent(s)</Pill>
                          <Pill variant="warning">{c.late} retard(s)</Pill>
                          <Pill variant="neutral">{c.excused} justifié(s)</Pill>
                          <Pill variant="danger">{c.absent} absent(s)</Pill>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Détails</CardTitle>
            <CardDescription>Liste joueurs + actions rapides. (UI-only, pas de DB)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : !selectedSession ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune sélection</p>
                <p className="mt-1 text-sm text-white/65">Choisissez une séance dans la liste.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Séance</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedSession.team}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {selectedSession.day} • {sessionTimeLabel(selectedSession)} • {selectedSession.location}
                  </p>
                  <p className="mt-1 text-xs text-white/45">maj {selectedSession.updatedAtLabel} (mock)</p>
                </div>

                {selectedCounts ? (
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55">Résumé</p>
                    <div className="flex flex-wrap gap-2">
                      <Pill variant="success">{selectedCounts.present} présent(s)</Pill>
                      <Pill variant="warning">{selectedCounts.late} retard(s)</Pill>
                      <Pill variant="neutral">{selectedCounts.excused} justifié(s)</Pill>
                      <Pill variant="danger">{selectedCounts.absent} absent(s)</Pill>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-white/45">Actions locales — persistance navigateur (localStorage).</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch({ type: "resetSession", sessionId: selectedSession.id })}
                  >
                    Réinitialiser la séance
                  </Button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Joueurs</p>
                  <ul className="mt-3 grid gap-2">
                    {selectedSession.rows.map((row) => {
                      const rowState = state[selectedSession.id]?.[row.id];
                      const status = rowState?.status ?? row.status;
                      const updatedAtLabel = rowState?.updatedAtLabel ?? selectedSession.updatedAtLabel;

                      const options: AttendanceStatus[] = ["present", "late", "excused", "absent"];

                      return (
                        <li
                          key={row.id}
                          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{row.playerName}</p>
                              <p className="mt-1 text-xs text-white/45">maj {updatedAtLabel}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Pill variant={statusVariant(status)}>{statusLabel(status)}</Pill>
                              <div className="flex flex-wrap gap-2" role="group" aria-label="Statut de présence">
                                {options.map((opt) => {
                                  const pressed = status === opt;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                        pressed
                                          ? "border-white/30 bg-white/10 text-white"
                                          : "border-white/10 bg-black/10 text-white/65 hover:border-white/20 hover:bg-white/5"
                                      }`}
                                      aria-pressed={pressed}
                                      onClick={() =>
                                        dispatch({
                                          type: "setStatus",
                                          sessionId: selectedSession.id,
                                          rowId: row.id,
                                          status: opt,
                                        })
                                      }
                                    >
                                      {statusLabel(opt)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" disabled>
                    Envoyer relance (bientôt)
                  </Button>
                  <Button size="sm" variant="ghost" disabled>
                    Pointer via QR (bientôt)
                  </Button>
                </div>

                <p className="text-xs text-white/45">
                  Next : vue par joueur (historique), export feuille de match, liens planning ↔ présences, permissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
