import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { dashboardTeamsMock } from "@/lib/mocks/dashboardTeams";
import { dashboardCategoriesMock } from "@/lib/mocks/dashboardCategories";
import { dashboardPlayersMock } from "@/lib/mocks/dashboardPlayers";
import { licenceRowsMock } from "@/lib/mocks/dashboardLicences";
import { dashboardEquipmentMock } from "@/lib/mocks/dashboardEquipment";
import { planningSessionsMock } from "@/lib/mocks/dashboardPlanning";

export const metadata: Metadata = {
  title: "Dashboard (Staff) · GBA Portal",
  description: "Espace staff (mock). Navigation par modules : équipes, catégories, joueurs, planning, licences, équipements.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

function equipmentTodoCount() {
  return dashboardEquipmentMock.filter((p) => {
    const total = p.items.length;
    const given = p.items.filter((i) => i.given).length;
    return given !== total;
  }).length;
}

function licencesToCollectCount() {
  return licenceRowsMock.filter((r) => r.status !== "paid").length;
}

function licencesOverdueCount() {
  return licenceRowsMock.filter((r) => r.status !== "paid" && r.isOverdue).length;
}

const topStats = [
  { label: "Équipes", value: dashboardTeamsMock.length, hint: "(mock)", href: "/dashboard/equipes" },
  { label: "Catégories", value: dashboardCategoriesMock.length, hint: "(mock)", href: "/dashboard/categories" },
  { label: "Joueurs", value: dashboardPlayersMock.length, hint: "(mock)", href: "/dashboard/joueurs" },
  { label: "Séances (planning)", value: planningSessionsMock.length, hint: "(mock)", href: "/dashboard/planning" },
];

const alerts = [
  {
    label: "Licences à encaisser",
    value: licencesToCollectCount(),
    hint: `${licencesOverdueCount()} en retard`,
    href: "/dashboard/licences",
  },
  {
    label: "Équipements à remettre",
    value: equipmentTodoCount(),
    hint: "joueurs incomplets",
    href: "/dashboard/equipements",
  },
];

const modules = [
  {
    title: "Équipes",
    desc: "Liste + fiche équipe (staff) — filtres pôle/catégorie, sélection master/detail.",
    href: "/dashboard/equipes",
  },
  {
    title: "Catégories",
    desc: "Vue catégories (responsables, périmètre, volumes) — filtres pôle + recherche.",
    href: "/dashboard/categories",
  },
  {
    title: "Joueurs",
    desc: "Liste + fiche joueur — filtres (pôle, équipe, licence, équipement) + tags statut.",
    href: "/dashboard/joueurs",
  },
  {
    title: "Planning (pôles)",
    desc: "Vue semaine en colonnes — filtres pôle + recherche (équipe/staff/lieu).",
    href: "/dashboard/planning",
  },
  {
    title: "Licences & paiements",
    desc: "Suivi des paiements licence — statuts, retards, actions locales (+20€, marquer payée).",
    href: "/dashboard/licences",
  },
  {
    title: "Équipements",
    desc: "Dotations (tailles / remis / non remis) — liste + détails, actions locales de remise.",
    href: "/dashboard/equipements",
  },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    accessCode?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const accessCodeRaw = resolvedSearchParams?.accessCode;
  const accessCode = typeof accessCodeRaw === "string" && accessCodeRaw.trim() ? accessCodeRaw.trim() : null;
  const isDemo = accessCode?.toUpperCase() === "DEMO";

  return (
    <div className="grid gap-6">
      {!accessCode ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          <p className="text-xs font-bold uppercase tracking-widest text-white/55">Accès</p>
          <p className="mt-3">
            Cet espace est pensé pour le staff. Pour suivre le parcours “entrée” (sans authentification), passez par{" "}
            <Link href="/login?next=/dashboard" className="font-semibold text-white/85 underline-offset-4 hover:underline">
              /login
            </Link>
            .
          </p>
          <p className="mt-2 text-xs text-white/45">
            Pas d’auth/DB pour l’instant : ce bandeau sert uniquement à clarifier le routing.
          </p>
        </div>
      ) : null}

      {accessCode ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          <p className="text-xs font-bold uppercase tracking-widest text-white/55">Session (placeholder)</p>
          <p className="mt-3">
            Code saisi sur{" "}
            <Link href="/login" className="font-semibold text-white/85 underline-offset-4 hover:underline">
              /login
            </Link>
            {" "}: {" "}
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold text-white/80">
              {accessCode}
            </span>
          </p>
          {isDemo ? (
            <p className="mt-2 text-xs text-white/55">
              Mode démo : utile pour montrer l’UI + le routing login → dashboard sans raconter une histoire d’auth.
            </p>
          ) : null}
          <p className="mt-2 text-xs text-white/45">
            Rien n’est vérifié : pas d’auth, pas de DB. Ce bloc sert juste à rendre le flux login → dashboard concret.
          </p>
        </div>
      ) : null}

      <div>
        <p className="text-xs uppercase tracking-widest text-white/60">Vue d’ensemble</p>
        <h2 className="mt-3 font-[var(--font-teko)] text-3xl font-black tracking-[0.06em] text-white md:text-4xl">
          Dashboard staff
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Données mock + UI-only. Objectif : figer l’UX “app-like” et les écrans clés avant d’ajouter une DB.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {topStats.map((s) => (
          <Link key={s.label} href={s.href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
            <Card className="premium-card card-shell rounded-3xl transition hover:border-white/20">
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-widest text-white/55">{s.label}</CardDescription>
                <CardTitle className="text-3xl font-black tracking-tight text-white">
                  {s.value}
                  <span className="ml-2 text-xs font-semibold text-white/45">{s.hint}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((a) => (
          <Link key={a.label} href={a.href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
            <Card className="premium-card card-shell rounded-3xl transition hover:border-white/20">
              <CardHeader>
                <CardDescription className="text-xs uppercase tracking-widest text-white/55">À traiter</CardDescription>
                <CardTitle className="text-3xl font-black tracking-tight text-white">{a.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-white">{a.label}</p>
                <p className="mt-1 text-xs text-white/55">{a.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
            <CardDescription>
              Navigation rapide vers les écrans staff. Tout est mock (pas de DB), les actions “mutantes” restent locales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3">
              {modules.map((m) => (
                <li key={m.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{m.title}</p>
                      <p className="mt-1 text-sm text-white/70">{m.desc}</p>
                    </div>
                    <Link href={m.href} className="shrink-0">
                      <Button size="sm" variant="secondary">
                        Ouvrir
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="premium-card card-shell rounded-3xl">
          <CardHeader>
            <CardTitle>Accès & permissions</CardTitle>
            <CardDescription>UI-only. Les rôles seront branchés plus tard (auth + DB).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-white/55">Placeholder permissions</p>
                <p className="mt-2 text-sm text-white/70">
                  Rôles envisagés : <span className="font-semibold text-white/80">admin</span>,{" "}
                  <span className="font-semibold text-white/80">staff</span>,{" "}
                  <span className="font-semibold text-white/80">coach</span>.
                </p>
                <p className="mt-2 text-xs text-white/45">
                  À venir : gating UI (lecture seule vs édition), traces d’audit, exports.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="sm" variant="secondary">
                    Connexion
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="sm" variant="ghost">
                    Retour vitrine
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-white/45">
                Note : pas de persistance. Les modules avec actions (paiements, remise équipements) perdent l’état au refresh.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-white/45">
        Prochaine itération probable : liens “pré-filtrés” entre modules (ex. depuis une catégorie → joueurs/équipes filtrés).
      </p>
    </div>
  );
}
