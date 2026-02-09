"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  dashboardPlayersMock,
  dashboardPlayerPoles,
  type DashboardPlayer,
  type PlayerEquipmentStatus,
  type PlayerLicenceStatus,
  type PlayerPole,
} from "@/lib/mocks/dashboardPlayers";

function inputBaseClassName() {
  return "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20";
}

function positionLabel(pos: DashboardPlayer["position"]) {
  switch (pos) {
    case "G":
      return "Gardien";
    case "D":
      return "Défenseur";
    case "M":
      return "Milieu";
    case "A":
      return "Attaquant";
    default:
      return pos;
  }
}

function licenceLabel(status: PlayerLicenceStatus) {
  switch (status) {
    case "draft":
      return "brouillon";
    case "pending":
      return "en attente";
    case "validated":
      return "validée";
    default:
      return status;
  }
}

function equipmentLabel(status: PlayerEquipmentStatus) {
  switch (status) {
    case "missing":
      return "à fournir";
    case "partial":
      return "partiel";
    case "complete":
      return "complet";
    default:
      return status;
  }
}

function pillTone(kind: "ok" | "warn" | "danger") {
  switch (kind) {
    case "ok":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    case "warn":
      return "border-amber-400/25 bg-amber-500/10 text-amber-100";
    case "danger":
      return "border-rose-400/25 bg-rose-500/10 text-rose-100";
    default:
      return "border-white/15 bg-black/20 text-white/70";
  }
}

function licenceTone(status: PlayerLicenceStatus) {
  if (status === "validated") return pillTone("ok");
  if (status === "pending") return pillTone("warn");
  return pillTone("danger");
}

function equipmentTone(status: PlayerEquipmentStatus) {
  if (status === "complete") return pillTone("ok");
  if (status === "partial") return pillTone("warn");
  return pillTone("danger");
}

import { CreatePlayerModal } from "@/components/dashboard/CreatePlayerModal";

export default function DashboardJoueursPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [players, setPlayers] = React.useState<DashboardPlayer[]>([]);
  const [query, setQuery] = React.useState("");
  const [pole, setPole] = React.useState<PlayerPole | "all">("all");
  const [category, setCategory] = React.useState<string | "all">("all");
  const [team, setTeam] = React.useState<string | "all">("all");
  const [licenceStatus, setLicenceStatus] = React.useState<PlayerLicenceStatus | "all">("all");
  const [equipmentStatus, setEquipmentStatus] = React.useState<PlayerEquipmentStatus | "all">("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const didInitFromUrl = React.useRef(false);

  React.useEffect(() => {
    if (didInitFromUrl.current) return;

    const sp = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

    const qRaw = sp.get("q") ?? sp.get("query");
    const poleRaw = sp.get("pole");
    const categoryRaw = sp.get("category");
    const teamRaw = sp.get("team");
    const licenceRaw = sp.get("licence") ?? sp.get("licenceStatus");
    const equipmentRaw = sp.get("equipment") ?? sp.get("equipmentStatus");
    const playerIdRaw = sp.get("player") ?? sp.get("playerId");

    if (typeof qRaw === "string" && qRaw.trim()) setQuery(qRaw);

    const poles: Array<PlayerPole> = ["École de foot", "Pré-formation", "Formation"];
    if (poleRaw && poles.includes(poleRaw as PlayerPole)) setPole(poleRaw as PlayerPole);

    if (typeof categoryRaw === "string" && categoryRaw.trim()) setCategory(categoryRaw.trim());
    if (typeof teamRaw === "string" && teamRaw.trim()) setTeam(teamRaw.trim());

    const licenceOptions: Array<PlayerLicenceStatus> = ["draft", "pending", "validated"];
    if (licenceRaw && licenceOptions.includes(licenceRaw as PlayerLicenceStatus)) {
      setLicenceStatus(licenceRaw as PlayerLicenceStatus);
    }

    const equipmentOptions: Array<PlayerEquipmentStatus> = ["missing", "partial", "complete"];
    if (equipmentRaw && equipmentOptions.includes(equipmentRaw as PlayerEquipmentStatus)) {
      setEquipmentStatus(equipmentRaw as PlayerEquipmentStatus);
    }

    if (typeof playerIdRaw === "string" && playerIdRaw.trim()) setSelectedId(playerIdRaw.trim());

    didInitFromUrl.current = true;
  }, []);

  React.useEffect(() => {
    // Initialize with mock data
    setPlayers(dashboardPlayersMock);
    
    const t = window.setTimeout(() => {
      setIsLoading(false);
      setSelectedId((prev) => prev ?? dashboardPlayersMock[0]?.id ?? null);
    }, 520);

    return () => window.clearTimeout(t);
  }, []);

  const handleCreatePlayer = (newPlayer: Omit<DashboardPlayer, "id" | "updatedAtLabel" | "medicalStatusLabel" | "licenceStatus" | "equipmentStatus">) => {
    const id = `pl-new-${Date.now()}`;
    const player: DashboardPlayer = {
      ...newPlayer,
      id,
      medicalStatusLabel: "à vérifier",
      licenceStatus: "draft",
      equipmentStatus: "missing",
      updatedAtLabel: "à l'instant",
    };
    
    setPlayers((prev) => [player, ...prev]);
    setSelectedId(id);
  };

  const categories = React.useMemo(() => {
    return Array.from(new Set(players.map((p) => p.category))).sort((a, b) => a.localeCompare(b));
  }, [players]);

  const teams = React.useMemo(() => {
    return Array.from(new Set(players.map((p) => p.team))).sort((a, b) => a.localeCompare(b));
  }, [players]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return players
      .filter((p) => (pole === "all" ? true : p.pole === pole))
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) => (team === "all" ? true : p.team === team))
      .filter((p) => (licenceStatus === "all" ? true : p.licenceStatus === licenceStatus))
      .filter((p) => (equipmentStatus === "all" ? true : p.equipmentStatus === equipmentStatus))
      .filter((p) => {
        if (!q) return true;
        const hay = `${p.firstName} ${p.lastName} ${p.team} ${p.category} ${p.pole}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [players, query, pole, category, team, licenceStatus, equipmentStatus]);

  const selectedPlayer = React.useMemo(() => {
    return filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  React.useEffect(() => {
    if (!selectedPlayer) setSelectedId(null);
    else setSelectedId(selectedPlayer.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlayer?.id]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Joueurs
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Liste + fiche joueur (mock) avec filtres. Les actions (édition, export, licence, équipement) sont des placeholders.
        </p>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>Recherche par nom, puis filtrage par pôle / catégorie / équipe / statuts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2 md:col-span-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recherche</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Diallo, U17, GBA U11…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher un joueur"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as PlayerPole | "all")}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                {dashboardPlayerPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Catégorie</span>
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

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Équipe</span>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className={inputBaseClassName()}
                aria-label="Filtrer par équipe"
              >
                <option value="all">Toutes équipes</option>
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Licence</span>
              <select
                value={licenceStatus}
                onChange={(e) => setLicenceStatus(e.target.value as PlayerLicenceStatus | "all")}
                className={inputBaseClassName()}
                aria-label="Filtrer par statut de licence"
              >
                <option value="all">Tous statuts</option>
                <option value="draft">Brouillon</option>
                <option value="pending">En attente</option>
                <option value="validated">Validée</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Équipement</span>
              <select
                value={equipmentStatus}
                onChange={(e) => setEquipmentStatus(e.target.value as PlayerEquipmentStatus | "all")}
                className={inputBaseClassName()}
                aria-label="Filtrer par statut équipement"
              >
                <option value="all">Tous statuts</option>
                <option value="missing">À fournir</option>
                <option value="partial">Partiel</option>
                <option value="complete">Complet</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading ? "Chargement des joueurs…" : `${filtered.length} joueur(s) (mock)`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setPole("all");
                  setCategory("all");
                  setTeam("all");
                  setLicenceStatus("all");
                  setEquipmentStatus("all");
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(true)}>
                Ajouter un joueur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Liste</CardTitle>
            <CardDescription>Sélectionnez un joueur pour afficher la fiche.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-[86px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </ul>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucun joueur</p>
                <p className="mt-1 text-sm text-white/65">
                  Essayez de modifier les filtres, ou de simplifier la recherche.
                </p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filtered.map((p) => {
                  const isSelected = p.id === selectedPlayer?.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7"
                        }`}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">
                              {p.lastName} {p.firstName}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {p.team} • {p.category} • {p.pole}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-white">{p.birthYear}</p>
                            <p className="text-xs text-white/45">naissance</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${licenceTone(
                              p.licenceStatus,
                            )}`}
                          >
                            licence {licenceLabel(p.licenceStatus)}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${equipmentTone(
                              p.equipmentStatus,
                            )}`}
                          >
                            équipement {equipmentLabel(p.equipmentStatus)}
                          </span>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            maj {p.updatedAtLabel}
                          </span>
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
            <CardTitle>Fiche joueur</CardTitle>
            <CardDescription>Résumé + actions futures (placeholders).</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : !selectedPlayer ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune sélection</p>
                <p className="mt-1 text-sm text-white/65">Choisissez un joueur dans la liste.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Joueur</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {selectedPlayer.firstName} {selectedPlayer.lastName}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {selectedPlayer.team} • {selectedPlayer.category} • {selectedPlayer.pole}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Infos rapides (mock)</p>
                  <dl className="mt-3 grid gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Année</dt>
                      <dd className="text-sm font-semibold text-white">{selectedPlayer.birthYear}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Poste</dt>
                      <dd className="text-sm font-semibold text-white">{positionLabel(selectedPlayer.position)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Médical</dt>
                      <dd className="text-sm font-semibold text-white">{selectedPlayer.medicalStatusLabel}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Responsable</dt>
                      <dd className="text-sm font-semibold text-white">
                        {selectedPlayer.guardianName ?? "—"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Téléphone</dt>
                      <dd className="text-sm font-semibold text-white">{selectedPlayer.phone ?? "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" disabled>
                    Éditer (bientôt)
                  </Button>
                  <Button size="sm" variant="ghost" disabled>
                    Export fiche (bientôt)
                  </Button>
                  <Button size="sm" variant="ghost" disabled>
                    Marquer licence (bientôt)
                  </Button>
                </div>

                <p className="text-xs text-white/45">
                  À venir : import CSV, liens vers licences & paiements, équipements détaillés (tailles / remis), suivi présences.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreatePlayerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePlayer}
      />
    </div>
  );
}
