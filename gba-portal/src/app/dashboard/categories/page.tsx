"use client";

import * as React from "react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  dashboardCategoriesMock,
  dashboardCategoryPoles,
  type CategoryPole,
  type DashboardCategory,
} from "@/lib/mocks/dashboardCategories";

function inputBaseClassName() {
  return "w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/20";
}

function roleLabel(role: DashboardCategory["leadStaff"][number]["role"]) {
  switch (role) {
    case "resp-categorie":
      return "Resp. catégorie";
    case "coord":
      return "Coordinateur";
    case "coach":
      return "Coach";
    default:
      return role;
  }
}

function defaultSelectedId() {
  return dashboardCategoriesMock[0]?.id ?? null;
}

export default function DashboardCategoriesPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [pole, setPole] = React.useState<CategoryPole | "all">("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoading(false);
      setSelectedId((prev) => prev ?? defaultSelectedId());
    }, 420);

    return () => window.clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return dashboardCategoriesMock
      .filter((c) => (pole === "all" ? true : c.pole === pole))
      .filter((c) => {
        if (!q) return true;
        const hay = `${c.name} ${c.pole} ${c.teamsLabel} ${c.ageRangeLabel} ${c.leadStaff.map((s) => s.name).join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [pole, query]);

  const selectedCategory = React.useMemo(() => {
    return filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  React.useEffect(() => {
    if (!selectedCategory) setSelectedId(null);
    else setSelectedId(selectedCategory.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?.id]);

  const stats = React.useMemo(() => {
    return filtered.reduce(
      (acc, c) => {
        acc.categories += 1;
        acc.teams += c.teamsCount;
        acc.players += c.playersEstimate;
        if (c.leadStaff.some((s) => s.role === "resp-categorie")) acc.withOwner += 1;
        return acc;
      },
      { categories: 0, teams: 0, players: 0, withOwner: 0 },
    );
  }, [filtered]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">Module</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Catégories
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Vue “staff” des catégories (U6→U18, seniors…) avec responsables, volumes (équipes/joueurs) et notes. Données mock +
          state local uniquement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Catégories (filtre)</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{stats.categories}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Équipes (est.)</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{stats.teams}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardDescription className="text-xs uppercase tracking-[0.35em] text-white/55">Joueurs (est.)</CardDescription>
            <CardTitle className="text-3xl font-black tracking-tight text-white">{stats.players}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="premium-card card-shell rounded-3xl">
        <CardHeader>
          <CardTitle>Recherche & filtres</CardTitle>
          <CardDescription>Filtrer par pôle et rechercher par catégorie / équipes / staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recherche</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: U12, seniors, Bernard…"
                className={inputBaseClassName()}
                inputMode="search"
                aria-label="Rechercher une catégorie"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Pôle</span>
              <select
                value={pole}
                onChange={(e) => setPole(e.target.value as CategoryPole | "all")}
                className={inputBaseClassName()}
                aria-label="Filtrer par pôle"
              >
                <option value="all">Tous les pôles</option>
                {dashboardCategoryPoles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/60" aria-live="polite">
              {isLoading ? "Chargement des catégories…" : `${filtered.length} catégorie(s) (mock) • ${stats.withOwner} avec resp.`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setPole("all");
                }}
              >
                Réinitialiser
              </Button>
              <Button size="sm" variant="ghost" disabled>
                Ajouter (bientôt)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Liste</CardTitle>
            <CardDescription>Sélectionnez une catégorie pour afficher la fiche.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ul className="grid gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                ))}
              </ul>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune catégorie</p>
                <p className="mt-1 text-sm text-white/65">Essayez de modifier le pôle ou la recherche.</p>
              </div>
            ) : (
              <ul className="grid gap-3">
                {filtered.map((c) => {
                  const isSelected = c.id === selectedCategory?.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className={`group w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/7"
                        }`}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{c.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/55">
                              {c.pole} • {c.ageRangeLabel}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-white">{c.teamsCount}</p>
                            <p className="text-xs text-white/45">équipes</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/65">
                            {c.playersEstimate} joueurs (est.)
                          </span>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            maj {c.updatedAtLabel}
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
            <CardTitle>Fiche</CardTitle>
            <CardDescription>Résumé + responsables (mock) + actions futures.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3">
                <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              </div>
            ) : !selectedCategory ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">Aucune sélection</p>
                <p className="mt-1 text-sm text-white/65">Choisissez une catégorie dans la liste.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Catégorie</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedCategory.name}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {selectedCategory.pole} • {selectedCategory.ageRangeLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Périmètre (mock)</p>
                  <dl className="mt-3 grid gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Équipes</dt>
                      <dd className="text-sm font-semibold text-white">{selectedCategory.teamsLabel}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-sm text-white/65">Volume</dt>
                      <dd className="text-sm font-semibold text-white">
                        {selectedCategory.playersEstimate} joueurs (est.)
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/55">Responsables (mock)</p>
                  {selectedCategory.leadStaff.length === 0 ? (
                    <p className="mt-2 text-sm text-white/65">Aucun responsable défini.</p>
                  ) : (
                    <ul className="mt-3 grid gap-2">
                      {selectedCategory.leadStaff.map((s) => (
                        <li key={s.id} className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold text-white">{s.name}</span>
                          <span className="rounded-full border border-white/15 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                            {roleLabel(s.role)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedCategory.notes ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/55">Note</p>
                    <p className="mt-2 text-sm text-white/70">{selectedCategory.notes}</p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/equipes?category=${encodeURIComponent(selectedCategory.name)}&pole=${encodeURIComponent(selectedCategory.pole)}`}>
                    <Button size="sm" variant="secondary">
                      Voir équipes
                    </Button>
                  </Link>
                  <Link href={`/dashboard/joueurs?category=${encodeURIComponent(selectedCategory.name)}&pole=${encodeURIComponent(selectedCategory.pole)}`}>
                    <Button size="sm" variant="secondary">
                      Voir joueurs
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" disabled>
                    Assigner responsables (bientôt)
                  </Button>
                  <Button size="sm" variant="ghost" disabled>
                    Export (bientôt)
                  </Button>
                </div>

                <p className="text-xs text-white/45">
                  À venir : lien direct vers les équipes/joueurs, planning par catégorie, détections, permissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
