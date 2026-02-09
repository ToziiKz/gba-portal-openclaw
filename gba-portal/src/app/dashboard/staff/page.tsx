"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { usePermissions } from "@/components/PermissionsProvider";

import {
  dashboardStaffMock,
  staffPoles,
  staffRoles,
  type DashboardStaffMember,
  type StaffAvailability,
  type StaffPole,
  type StaffRole,
} from "@/lib/mocks/dashboardStaff";

type AvailabilityFilter = StaffAvailability | "all";

type LocalState = {
  onDuty: boolean;
  updatedAtLabel: string;
};

function inputBaseClassName() {
  return "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20";
}

function availabilityVariant(a: StaffAvailability) {
  if (a === "ok") return "success" as const;
  if (a === "limited") return "warning" as const;
  return "neutral" as const;
}

function availabilityLabel(a: StaffAvailability) {
  if (a === "ok") return "dispo";
  if (a === "limited") return "limité";
  return "off";
}

function roleLabel(role: StaffRole) {
  switch (role) {
    case "dir-sportif":
      return "Direction sportive";
    case "resp-pole":
      return "Resp. pôle";
    case "prepa-physique":
      return "Prépa physique";
    case "gardien":
      return "Spé. gardiens";
    case "administratif":
      return "Administratif";
    case "medical":
      return "Médical";
    case "adjoint":
      return "Adjoint";
    default:
      return "Coach";
  }
}

function stats(members: DashboardStaffMember[], local: Record<string, LocalState>) {
  let total = 0;
  let onDuty = 0;
  let off = 0;
  let limited = 0;

  for (const m of members) {
    total += 1;
    if (local[m.id]?.onDuty) onDuty += 1;
    if (m.availability === "off") off += 1;
    if (m.availability === "limited") limited += 1;
  }

  return { total, onDuty, off, limited };
}

export default function DashboardStaffPage() {
  const { canEdit } = usePermissions();
  const [isLoading, setIsLoading] = React.useState(true);

  // Filters
  const [query, setQuery] = React.useState("");
  const [pole, setPole] = React.useState<StaffPole | "all">("all");
  const [role, setRole] = React.useState<StaffRole | "all">("all");
  const [availability, setAvailability] = React.useState<AvailabilityFilter>("all");

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<"infos" | "equipes" | "actions">("infos");

  // Local persistence for "On Duty" status
  const [localState, setLocalState] = React.useState<Record<string, LocalState>>(() =>
    Object.fromEntries(
      dashboardStaffMock.map((m) => [
        m.id,
        {
          onDuty: m.availability === "ok",
          updatedAtLabel: m.updatedAtLabel,
        },
      ]),
    ),
  );

  const didLoadPersisted = React.useRef(false);

  // Load from localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem("gba-dashboard-staff-state-v1");
      if (saved) {
        setLocalState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.warn("Failed to load staff state", e);
    }
    didLoadPersisted.current = true;
  }, []);

  // Save to localStorage
  React.useEffect(() => {
    if (!didLoadPersisted.current || typeof window === "undefined") return;
    window.localStorage.setItem("gba-dashboard-staff-state-v1", JSON.stringify(localState));
  }, [localState]);

  // Loading simulation
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoading(false);
      setSelectedId((prev) => prev ?? dashboardStaffMock[0]?.id ?? null);
    }, 420);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return dashboardStaffMock
      .filter((m) => (pole === "all" ? true : m.pole === pole))
      .filter((m) => (role === "all" ? true : m.role === role))
      .filter((m) => (availability === "all" ? true : m.availability === availability))
      .filter((m) => {
        if (!q) return true;
        const hay = `${m.fullName} ${m.role} ${m.pole} ${m.teamsLabel} ${m.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [query, pole, role, availability]);

  const selected = React.useMemo(() => {
    return filtered.find((m) => m.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  React.useEffect(() => {
    if (!selected) setSelectedId(null);
    else setSelectedId(selected.id);
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const kpis = React.useMemo(() => stats(filtered, localState), [filtered, localState]);

  function toggleOnDuty(id: string) {
    setLocalState((prev) => ({
      ...prev,
      [id]: {
        onDuty: !prev[id]?.onDuty,
        updatedAtLabel: "à l’instant",
      },
    }));
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Staff (annuaire)
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Annuaire staff (mock) avec persistance locale du statut &quot;On Duty&quot;.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Membres</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{kpis.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">En service</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{kpis.onDuty}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Dispo limitée</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{kpis.limited}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Off</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{kpis.off}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>Trouvez un membre par nom, pôle, rôle ou disponibilité.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recherche</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Julie, U13…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as StaffPole | "all")}
                className={inputBaseClassName()}
                aria-label="Pôle"
              >
                <option value="all">Tous</option>
                {staffPoles.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Rôle</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole | "all")}
                className={inputBaseClassName()}
                aria-label="Rôle"
              >
                {staffRoles.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2 md:col-span-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setPole("all");
                  setRole("all");
                  setAvailability("all");
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Liste */}
        <Card className="premium-card card-shell rounded-3xl h-[600px] flex flex-col">
          <CardHeader className="shrink-0">
            <CardTitle>Effectif</CardTitle>
            <CardDescription>{filtered.length} membre(s) trouvé(s)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-[80px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </ul>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-sm font-semibold text-white">Aucun résultat</p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filtered.map((m) => {
                  const isSelected = m.id === selected?.id;
                  const onDuty = localState[m.id]?.onDuty ?? false;

                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(m.id);
                          setTab("infos"); // Reset tab on change
                        }}
                        className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7"
                        }`}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{m.fullName}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {roleLabel(m.role)}
                            </p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-1">
                             <div className={`h-2 w-2 rounded-full ${onDuty ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-white/20"}`} />
                             <span className="text-[9px] uppercase tracking-wider text-white/30">{m.pole}</span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Fiche Détail */}
        <Card className="premium-card card-shell rounded-3xl h-[600px] flex flex-col">
          {isLoading || !selected ? (
             <div className="flex h-full items-center justify-center p-8 text-center text-white/40">
               <div className="grid place-items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-white/5" />
                 <p>Sélectionnez un membre pour voir les détails.</p>
               </div>
             </div>
          ) : (
            <>
              <div className="shrink-0 border-b border-white/10 p-6 pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">{selected.fullName}</h3>
                    <p className="text-sm text-white/60">{roleLabel(selected.role)}</p>
                  </div>
                  <div className="text-right">
                    <Pill variant={availabilityVariant(selected.availability)}>
                      {availabilityLabel(selected.availability)}
                    </Pill>
                    <p className="mt-1 text-[10px] text-white/40">
                      Maj: {localState[selected.id]?.updatedAtLabel ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-6 overflow-x-auto pb-1px">
                  {(["infos", "equipes", "actions"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`relative pb-3 text-xs font-bold uppercase tracking-widest transition hover:text-white ${
                        tab === t ? "text-white after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-white" : "text-white/40"
                      }`}
                    >
                      {t === "infos" ? "Informations" : t === "equipes" ? "Équipes" : "Actions"}
                    </button>
                  ))}
                </div>
              </div>

              <CardContent className="flex-1 overflow-y-auto pt-6">
                {tab === "infos" && (
                  <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/55">Coordonnées</p>
                      <dl className="grid gap-3">
                         <div className="flex justify-between">
                            <dt className="text-sm text-white/60">Email</dt>
                            <dd className="text-sm font-semibold text-white">{selected.email ?? "—"}</dd>
                         </div>
                         <div className="flex justify-between">
                            <dt className="text-sm text-white/60">Téléphone</dt>
                            <dd className="text-sm font-semibold text-white">{selected.phone ?? "—"}</dd>
                         </div>
                      </dl>
                    </div>

                    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/55">Contexte</p>
                      <dl className="grid gap-3">
                         <div className="flex justify-between">
                            <dt className="text-sm text-white/60">Pôle</dt>
                            <dd className="text-sm font-semibold text-white">{selected.pole}</dd>
                         </div>
                         <div className="flex justify-between">
                            <dt className="text-sm text-white/60">Équipes</dt>
                            <dd className="text-sm font-semibold text-white">{selected.teamsLabel}</dd>
                         </div>
                      </dl>
                    </div>

                    {selected.note && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-white/55 mb-2">Note interne</p>
                        <p className="text-sm text-white/70 italic leading-relaxed">&quot;{selected.note}&quot;</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                       {selected.tags.map(tag => (
                         <span key={tag} className="px-2 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-wider text-white/50">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
                )}

                {tab === "equipes" && (
                  <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                      <p className="text-white/50 text-sm">Ce membre intervient sur :</p>
                      <p className="text-2xl font-black text-white mt-2">{selected.teamsLabel}</p>
                    </div>
                    
                    <p className="text-xs text-center text-white/30">
                      Module d&apos;assignation des équipes en cours de développement.
                    </p>
                  </div>
                )}

                {tab === "actions" && (
                   <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {canEdit ? (
                        <div className="grid gap-4">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-white">Statut &quot;En Service&quot;</p>
                              <p className="text-xs text-white/50">Déclare la présence sur site</p>
                            </div>
                            <Button 
                              variant={localState[selected.id]?.onDuty ? "secondary" : "ghost"}
                              onClick={() => toggleOnDuty(selected.id)}
                            >
                              {localState[selected.id]?.onDuty ? "Désactiver" : "Activer"}
                            </Button>
                          </div>
                          
                          <Button variant="ghost" disabled className="w-full justify-start">
                            <span className="mr-2">✉️</span> Envoyer un message (bientôt)
                          </Button>
                          <Button variant="ghost" disabled className="w-full justify-start">
                             <span className="mr-2">✏️</span> Modifier la fiche (bientôt)
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                          <p className="text-sm text-white/60">Mode lecture seule.</p>
                        </div>
                      )}
                   </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
